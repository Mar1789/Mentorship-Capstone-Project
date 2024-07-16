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
  async function member2() {
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
    console.log("err");
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

  function getMentors() {
    fetch("http://localhost:3000/mentors", {
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

  useEffect(() => {
    auth();
    if (user) {
      getMentors();
      member2();
      const location = navigator.geolocation.getCurrentPosition(
        coordinates,
        err
      );
    }
  }, [user]);

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
                  <Popup>Ian</Popup>
                </Marker>
                <Marker
                  position={[
                    (latitude + mentorLatitude) / 2,
                    (longitude + mentorLongitude) / 2,
                  ]}
                >
                  <Popup></Popup>
                </Marker>
              </>
            )}
            <Marker position={[latitude, longitude]}>
              <Popup>You are Here</Popup>
            </Marker>
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
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Meetup;
