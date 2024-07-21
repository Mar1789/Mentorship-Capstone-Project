import { useState, useEffect } from "react";
import "./App.css";

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
  const [isFollowing, setIsFollowing] = useState(false);
  const follow = "Follow";
  const followed = "Unfollow";

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
  async function userProfile() {
    await fetch(`http://localhost:3000/user/${props.name}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        const dates = new Date(data.date).toLocaleDateString();
        setDate(moment(new Date(dates)).format("MMMM D, Y"));
        setProfile(data);
      })
    );
  }
  function getFollowers() {
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
  function setFollow() {
    fetch(`http://localhost:3000/followUser/${user.id}/${profile.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        if (data === 0) {
          setIsFollowing(false);
        } else {
          setIsFollowing(true);
        }
      })
    );
  }
  function handleFollow() {
    if (isFollowing === false) {
      fetch(`http://localhost:3000/follow/${profile.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ followId: user.id }),
      }).then((data) =>
        data.json().then((data) => {
          setIsFollowing(true);
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
          setIsFollowing(false);
        })
      );
    }
  }

  useEffect(() => {
    auth();
    userProfile();
  }, []);
  useEffect(() => {
    if (user) {
      getInfo();
    }
    if (profile && user) {
      setFollow();
      getFollowers();
    }
  }, [user, isFollowing, followers, profile]);

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
            {profile && user && profile.id !== user.id && (
              <button onClick={handleFollow}>
                {isFollowing ? followed : follow}
              </button>
            )}
          </Card>
        )}
      </div>
    </>
  );
};
export default Profile;
