import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "./components/Meetup.css";
import "leaflet/dist/leaflet.css";
import NavBar from "./components/Navbar";
import { useEffect, useState } from "react";

const Meetup = () => {
  const [user, setUser] = useState();
  const [info, setInfo] = useState("");
  const invalid = "Invalid Token";
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [mentorLatitude, setMentorLatitude] = useState();
  const [mentorLongitude, setMentorLongitude] = useState();
  const [middlepoint, setMiddlepoint] = useState(false);

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
        fetch("http://localhost:3000/coordinates", {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify({
            longitude: longitude,
            latitude: latitude,
            userId: 24,
          }),
        }).then((data) =>
          data.json().then((data) => {
            if (data === invalid) {
              window.location.href = "/";
            } else {
              localStorage.setItem("accessToken", data);
            }
          })
        );
    }
  }
  function err() {
    console.log("err");
  }
  function distance() {
    const l = 37.7919786;
    const lt = -122.4088564;
    const length1 = L.latLng(latitude, longitude);
    const length2 = L.latLng(l, lt);
    const distance = length1.distanceTo(length2) * 0.000621371;
  }

  useEffect(() => {
    auth();
    if (user) {
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
          <Marker
            position={[
              (37.334789 + latitude) / 2,
              (-121.888138 + longitude) / 2,
            ]}
          >
            <Popup></Popup>
          </Marker>
          <Marker position={[37.334789, -121.888138]}>
            <Popup>Ian</Popup>
          </Marker>
          <Marker position={[latitude, longitude]}></Marker>
        </MapContainer>
      )}
    </>
  );
};

export default Meetup;
