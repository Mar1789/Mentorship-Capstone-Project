import { useState, useEffect } from "react";
import "./App.css";

import "semantic-ui-css/semantic.min.css";

import moment from "moment";

import NavBar from "./components/Navbar";
import {
  Dimmer,
  Loader,
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
  const [isLoading, setIsLoading] = useState(false);
  const follow = "Follow";
  const followed = "Unfollow";

  async function auth() {
    setIsLoading(true);
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
          setIsLoading(false);
          setUser(data);
        }
      })
    );
  }

  async function getInfo() {
    setIsLoading(true);
    await fetch(`http://localhost:3000/user/${user.name}`, {
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
  async function userProfile() {
    setIsLoading(true);
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
        setIsLoading(false);
      })
    );
  }
  function getFollowers() {
    setIsLoading(true);
    fetch(`http://localhost:3000/followers/${profile.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setFollowers(data);
        setIsLoading(false);
      })
    );
  }

  function setFollow() {
    setIsLoading(true);
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
        setIsLoading(false);
      })
    );
  }
  function handleFollow() {
    setIsLoading(true);
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
          setIsLoading(false);
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
          setIsLoading(false);
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
      <Dimmer active={isLoading} inverted>
        <Loader inverted content="Loading" />
      </Dimmer>
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
