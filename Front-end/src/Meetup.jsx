import {
  CardMeta,
  CardHeader,
  CardContent,
  Card,
  Image,
} from "semantic-ui-react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import "./components/Meetup.css";
import "leaflet/dist/leaflet.css";
import NavBar from "./components/Navbar";
import { useEffect, useState } from "react";

function MyComponent(props) {
  const map = useMap();
  map.fitBounds(props.coordinates);
  useEffect(() => {
    props.setZoom(false);
  }, []);
  return null;
}

const Meetup = () => {
  const [user, setUser] = useState();
  const [info, setInfo] = useState("");
  const invalid = "Invalid Token";
  const [mentors, setMentors] = useState([]);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [mentorLatitude, setMentorLatitude] = useState();
  const [mentorLongitude, setMentorLongitude] = useState();
  const [middlepoint, setMiddlepoint] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [placeId, setPlaceId] = useState("");
  const [cafes, setCafes] = useState([]);

  async function auth() {
    let token = localStorage.getItem("accessToken");
    await fetch("http://localhost:4000/auth", {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((data) =>
      data.json().then((data) => {
        if (data === invalid) {
          token = localStorage.getItem("refreshToken");
          fetch("http://localhost:4000/token", {
            method: "POST",
            headers: {
              "Content-Type": "Application/json",
            },
            body: JSON.stringify({ token: token }),
          }).then((data) =>
            data.json().then((data) => {
              if (data === invalid) {
                window.location.href = "/";
              } else {
                localStorage.setItem("accessToken", data);
              }
            })
          );
        } else {
          setUser(data);
        }
      })
    );
  }
  async function getInfo() {
    await fetch(`http://localhost:3000/user/${user.name}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setInfo(data);
      })
    );
  }
  function coordinates(position) {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
    {
      latitude &&
        longitude &&
        info &&
        fetch("http://localhost:3000/coordinates", {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify({
            longitude: longitude,
            latitude: latitude,
            userId: 26,
          }),
        }).then((data) => data.json().then((data) => {}));
    }
  }
  function err() {
    alert("err");
  }
  function getCoords(e) {
    const userId = e.target.id;
    fetch(`http://localhost:3000/coordinates/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        if (data === "User has has not shared their location!") {
          alert("User has has not shared their location!");
        } else {
          setMentorLatitude(data[0].latitude);
          setMentorLongitude(data[0].longitude);
          setMiddlepoint(true);
          setZoom(true);
        }
      })
    );
  }
  function distance() {
    const length1 = L.latLng(latitude, longitude);
    const length2 = L.latLng(mentorLatitude, mentorLongitude);
    const middleLongitude = (longitude + mentorLongitude) / 2;
    const middleLatitude = (latitude + mentorLatitude) / 2;
    const distance = length1.distanceTo(length2) * 0.000621371;
    if (distance > 30) {
      alert(
        "You are both too far from each other! Please set up a time to meet through zoom"
      );
      setPlaceId("");
      setCafes([]);
    } else {
      fetch(
        `https://isitwater-com.p.rapidapi.com/?latitude=${middleLatitude}&longitude=${middleLongitude}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "Application/json",
            "x-rapidapi-key": import.meta.env.VITE_WATERKEY,
          },
        }
      ).then((data) =>
        data.json().then((data) => {
          if (data.water === true) {
            alert(
              "Middlepoint between you and the mentor is in a body of water. Please look into meeting through zoom"
            );
            setPlaceId("");
            setCafes([]);
          } else {
            fetch(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${middleLatitude}&lon=${middleLongitude}&format=json&apiKey=${
                import.meta.env.VITE_GEOAPIFYKEY
              }`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "Application/json",
                },
              }
            ).then((location) =>
              location.json().then((location) => {
                setPlaceId(location.results[0].place_id);
              })
            );
          }
        })
      );
    }
  }

  function findCafe() {
    fetch(
      `https://api.geoapify.com/v2/places?categories=catering.cafe&filter=place:${placeId}&limit=20&apiKey=${
        import.meta.env.VITE_GEOAPIFYKEY
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "Application/json",
        },
      }
    ).then((data) =>
      data.json().then((data) => {
        setCafes(data.features);
      })
    );
  }

  function getMentors() {
    fetch(`http://localhost:3000/mentors`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setMentors(data);
      })
    );
  }

  const customIcon = new L.icon({
    iconUrl: "../public/location.png",
    iconSize: [38, 38],
  });

  useEffect(() => {
    auth();
    if (user) {
      getMentors();
      getInfo();
      const location = navigator.geolocation.getCurrentPosition(
        coordinates,
        err
      );
    }
  }, [user]);
  useEffect(() => {
    if (mentorLatitude && mentorLongitude && zoom) {
      distance();
    }
  }, [mentorLatitude, mentorLongitude]);

  useEffect(() => {
    if (placeId) {
      findCafe();
    }
  }, [placeId]);

  return (
    <>
      {info && <NavBar info={info} />}
      <h1>Mentor Meetup</h1>
      <div className="meetup-container">
        {latitude && longitude && (
          <MapContainer
            center={[latitude, longitude]}
            zoom={11}
            scrollWheelZoom={true}
            className="height"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {middlepoint && mentorLatitude && mentorLongitude && (
              <>
                {zoom && (
                  <MyComponent
                    coordinates={[
                      [latitude, longitude],
                      [mentorLatitude, mentorLongitude],
                    ]}
                    setZoom={setZoom}
                  />
                )}
                <Marker position={[mentorLatitude, mentorLongitude]}>
                  <Popup>Mentor Location</Popup>
                </Marker>
              </>
            )}
            <Marker position={[latitude, longitude]}>
              <Popup>You are Here</Popup>
            </Marker>
            {cafes.map((cafe, index) => (
              <Marker
                id={index}
                key={index}
                icon={customIcon}
                position={[cafe.properties.lat, cafe.properties.lon]}
              >
                <Popup>
                  {cafe.properties.name && (
                    <>
                      Cafe Name: {cafe.properties.name} <br />
                    </>
                  )}
                  {cafe.properties.website && (
                    <>
                      Cafe Website: <a>{cafe.properties.website}</a> <br />
                    </>
                  )}
                  Directions: {cafe.properties.housenumber}{" "}
                  {cafe.properties.street}, {cafe.properties.city},{" "}
                  {cafe.properties.state}, {cafe.properties.postcode}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
        <div className="mentor-card-title">
          <h2>Choose a mentor to meet with</h2>
          <div className="mentor-cards">
            {mentors.map((mentor) => (
              <Card
                className="card-align"
                key={mentor.id}
                id={mentor.id}
                onClick={getCoords}
              >
                <CardContent id={mentor.id}>
                  <Image
                    floated="right"
                    id={mentor.id}
                    size="mini"
                    src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
                  />
                  <CardHeader id={mentor.id}>
                    {mentor.FirstName} {mentor.LastName}
                  </CardHeader>
                  <CardMeta id={mentor.id}>{mentor.Headline}</CardMeta>
                  <CardMeta id={mentor.id}>Located in {mentor.state}</CardMeta>
                </CardContent>
                <script
                  id="setmore_script"
                  src="https://storage.googleapis.com/fullintegration-live/webComponentAppListing/Container/setmoreIframeLive.js"
                ></script>
                <a
                  id="Setmore_button_iframe"
                  href="https://booking.setmore.com/scheduleappointment/757465e5-cf7a-4925-8a2a-db3fd96c3090"
                >
                  <img
                    border="none"
                    src="https://assets.setmore.com/setmore/images/2.0/Settings/book-now-black.svg"
                    alt="Book an appointment with Burner Account using Setmore"
                  />
                </a>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Meetup;
