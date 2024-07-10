import { useState, useEffect } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";

import moment from "moment";

import NavBar from "./components/Navbar";
import {
  CardMeta,
  CardHeader,
  CardDescription,
  CardContent,
  Card,
  Icon,
} from "semantic-ui-react";

const Profile = (props) => {
  const [date, setDate] = useState("");
  const [user, setUser] = useState();
  const [info, setInfo] = useState("");
  const [profile, setProfile] = useState();
  const [followers, setFollowers] = useState();
  const [status, setStatus] = useState();
  const [func, setFunc] = useState(false);

  async function Auth() {
    let token = localStorage.getItem("accessToken");
    await fetch("http://localhost:4000/auth", {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((data) =>
      data.json().then((data) => {
        if (data === "Invalid Token") {
          token = localStorage.getItem("refreshToken");
          fetch("http://localhost:4000/token", {
            method: "POST",
            headers: {
              "Content-Type": "Application/json",
            },
            body: JSON.stringify({ token: token }),
          }).then((data) =>
            data.json().then((data) => {
              if (data === "Invalid Token") {
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
  async function LogOut() {
    const token = localStorage.getItem("accessToken");
    await fetch("http://localhost:4000/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((data) =>
      data.json().then((data) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
      })
    );
  }
  async function Member2() {
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
  async function UProfile() {
    await fetch(`http://localhost:3000/user/${props.name}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        let dates = new Date(data.date).toLocaleDateString();
        setDate(moment(new Date(dates)).format("MMMM D, Y"));
        setProfile(data);
      })
    );
  }
  function Followers() {
    fetch(`http://localhost:3000/followers/${profile.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setFollowers(data);
      })
    );
  }
  function SetFollow() {
    fetch(`http://localhost:3000/followUser/${user.id}/${profile.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        if (data === 0) {
          setStatus("Follow");
        } else {
          setStatus("Unfollow");
        }
      })
    );
  }
  function handleFollow() {
    if (status === "Follow") {
      fetch(`http://localhost:3000/follow/${profile.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ followId: user.id }),
      }).then((data) =>
        data.json().then((data) => {
          setStatus("Unfollow");
        })
      );
    } else {
      fetch(`http://localhost:3000/follow/${profile.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ followId: user.id }),
      }).then((data) =>
        data.json().then((data) => {
          setStatus("Follow");
        })
      );
    }
  }

  useEffect(() => {
    Auth();
  }, []);
  useEffect(() => {
    if (user) {
      Member2();
    }
    UProfile();
    if (profile && user) {
      SetFollow();
      Followers();
    }
    setFunc(true);
  }, [user, status, followers]);

  return (
    <>
      <NavBar info={info} />
      <div className="profile-card">
        {profile && date && (
          <Card>
            <img src="https://react.semantic-ui.com/images/avatar/large/matthew.png" />
            <CardContent>
              <CardHeader>
                {profile.FirstName + " " + profile.LastName}
              </CardHeader>
              <CardMeta>
                <span className="date">Joined in {date}</span>
              </CardMeta>
              <CardDescription>{profile.Headline}</CardDescription>
            </CardContent>
            <CardContent extra>
              <a>
                <Icon name="user" />
                {followers} Followers
              </a>
            </CardContent>
            {profile && user && profile.id !== user.id && <button onClick={handleFollow}>{status}</button>}
          </Card>
        )}
      </div>
    </>
  );
};
export default Profile;
