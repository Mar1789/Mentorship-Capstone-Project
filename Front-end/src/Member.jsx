import { useState, useEffect } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";

import Navbar from "./components/Navbar";
import Post from "./components/Post";

import { GridRow, GridColumn, Grid } from "semantic-ui-react";

const Member = () => {
  const [user, setUser] = useState();
  const [info, setInfo] = useState("");
  const [posts, setPosts] = useState([]);

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
              if (data === "Invalid Token" || data === "FAILED") {
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
  async function getPosts() {
    await fetch("http://localhost:3000/posts", {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setPosts(data);
      })
    );
  }
  useEffect(() => {
    auth();
  }, []);
  useEffect(() => {
    if (user) {
      getInfo();
      getPosts();
    }
  }, [user, posts]);
  return (
    <>
      <Navbar info={info} />
      {info && (
        <h1 className="welcome">
          Welcome: {info.FirstName + " " + info.LastName}
        </h1>
      )}
      <div className="post-center">
        <Grid divided="vertically" className="sizing">
          {info &&
            posts.map((post) => (
              <GridRow columns={1} key={post.Post_id}>
                <GridColumn>
                  <Post
                    userid={info.id}
                    id={post.Post_id}
                    author={post.userId}
                    date={post.createdAt}
                    text={post.description}
                    title={post.title}
                  />
                </GridColumn>
              </GridRow>
            ))}
        </Grid>
      </div>
    </>
  );
};
export default Member;
