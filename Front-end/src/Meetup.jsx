import {
  Dimmer,
  Loader,
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
import { getDistance } from "geolib";

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
  const [isLoading, setIsLoading] = useState(false);

  // Checks if the user has a valid token to be on the page
  async function auth() {
    setIsLoading(true);
    let token = localStorage.getItem("accessToken");
    await fetch("https://mentorship-capstone-project-auth-js.onrender.com/auth", {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((data) =>
      data.json().then((data) => {
        if (data === invalid) {
          // If the token is invalid, the program will try to get a new access token by validating the refresh token
          token = localStorage.getItem("refreshToken");
          fetch("https://mentorship-capstone-project-auth-js.onrender.com/token", {
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
          // Set user information
          setUser(data);
          setIsLoading(false);
        }
      })
    );
  }

  async function getInfo() {
    setIsLoading(true);
    await fetch(`https://mentorship-capstone-project.onrender.com/user/${user.name}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setInfo(data);
        setIsLoading(false);
      })
    );
  }
  async function postCoordinates(position) {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
    setIsLoading(true);
    {
      info &&
        fetch("https://mentorship-capstone-project.onrender.com/coordinates", {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            userId: info.id,
          }),
        }).then((data) =>
          data.json().then((data) => {
            setIsLoading(false);
          })
        );
    }
  }
  function err() {
    alert("err");
  }
  async function getCoords(e) {
    const userId = e.target.id;
    setIsLoading(true);
    await fetch(`https://mentorship-capstone-project.onrender.com/coordinates/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        if (data === "User has has not shared their location!") {
          alert("User has has not shared their location!");
          setIsLoading(false);
        } else {
          setMentorLatitude(data[0].latitude);
          setMentorLongitude(data[0].longitude);
          setMiddlepoint(true);
          setZoom(true);
          setIsLoading(false);
        }
      })
    );
  }
  function distance() {
    const middleLongitude = (longitude + mentorLongitude) / 2;
    const middleLatitude = (latitude + mentorLatitude) / 2;
    const convertMiles = 0.000621371;
    // Calculates distance between both users and converts meters to miles
    const distance =
      getDistance(
        { latitude: latitude, longitude: longitude },
        { latitude: mentorLatitude, longitude: mentorLongitude }
      ) * convertMiles;
    setIsLoading(true);
    if (distance > 30) {
      alert(
        "You are both too far from each other! Please set up a time to meet through zoom"
      );
      setPlaceId("");
      setCafes([]);
      setIsLoading(false);
    } else {
      // Calls the API to check if the middlepoint is in water
      waterDetector(
        latitude,
        longitude,
        mentorLatitude,
        mentorLongitude,
        middleLatitude,
        middleLongitude
      );
    }
  }
  // Function to test if the middlepoint is under water
  async function waterDetector(
    latitude,
    longitude,
    mentorLatitude,
    mentorLongitude,
    middleLatitude,
    middleLongitude
  ) {
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
          // If the middlepoint is in water, the program will call Geoapify's route API to get the coordinates of the route between both users
          findMiddlePoint(
            latitude,
            longitude,
            mentorLatitude,
            mentorLongitude,
            middleLatitude,
            middleLongitude
          );
        } else {
          reverseGeocode(middleLatitude, middleLongitude);
        }
      })
    );
  }

  // Looks for the middle point coordinate by using Geoapify's Routing API
  async function findMiddlePoint(
    latitude,
    longitude,
    mentorLatitude,
    mentorLongitude,
    middleLatitude,
    middleLongitude
  ) {
    fetch(
      `https://api.geoapify.com/v1/routing?waypoints=${latitude},${longitude}|${mentorLatitude},${mentorLongitude}&mode=drive&apiKey=${
        import.meta.env.VITE_GEOAPIFYKEY
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "Application/json",
        },
      }
    ).then((location) =>
      location
        .json()
        .then((location) => {
          if (
            location.message &&
            location.message === "No path could be found for input"
          ) {
            setIsLoading(false);
            return alert(
              "No path can be found for the input. Please meet through zoom."
            );
          }
          //Coordinates store every waypoint that a car would be in the route throughout the trip
          let coordinates = location.features[0].geometry.coordinates[0];
          return Promise.all([
            findCoordinates(coordinates, middleLatitude, middleLongitude),
          ]);
        })
        .then((coordinates) => {
          if (coordinates) {
            const coordsLatitude = coordinates[0][1];
            const coordsLongitude = coordinates[0][1];
            reverseGeocode(coordsLatitude, coordsLongitude);
          }
        })
    );
  }
  async function reverseGeocode(latitude, longitude) {
    fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${
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
        setIsLoading(false);
      })
    );
  }

  // Find coordinates that are the closest to the middlepoint on land
  async function findCoordinates(coordinates, middleLatitude, middleLongitude) {
    let mini = 10000; // Default value so the first index can change
    let distance;
    let index;
    const convertMiles = 0.000621371;
    coordinates.map((coordinates, indexe) => {
      distance = getDistance(
        { latitude: middleLatitude, longitude: middleLongitude },
        { latitude: coordinates[1], longitude: coordinates[0] }
      );
      // Convert meters to miles
      distance *= convertMiles;
      // If the distance is less than the current smallest distance, set it as the new smallest
      if (distance < mini) {
        index = indexe;
        mini = distance;
      }
    });
    // Returns the coordinates that is the closest to the midpoint coordinates in water
    return coordinates[index];
  }
  // Looks for nearby cafes by place id
  function findCafe() {
    setIsLoading(true);
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
        setIsLoading(false);
      })
    );
  }

  function getMentors() {
    setIsLoading(true);
    fetch(`https://mentorship-capstone-project.onrender.com/mentors`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setMentors(data);
        setIsLoading(false);
      })
    );
  }

  const customIcon = new L.icon({
    iconUrl: "../dist/location.png",
    iconSize: [38, 38],
  });

  useEffect(() => {
    auth();
  }, []);
  useEffect(() => {
    if (user) {
      getMentors();
      getInfo();
    }
  }, [user]);
  useEffect(() => {
    if (info) {
      const location = navigator.geolocation.getCurrentPosition(
        postCoordinates,
        err
      );
      setIsLoading(true);
    }
  }, [info]);
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
      <Dimmer active={isLoading} inverted>
        <Loader inverted content="Loading" />
      </Dimmer>
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
                {/* Handles the zoom feature when users click on a mentor */}
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
                      Cafe Website:{" "}
                      <a href={cafe.properties.website} target="_blank">
                        {cafe.properties.website}
                      </a>{" "}
                      <br />
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
                  href={mentor.bookingLink}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
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
