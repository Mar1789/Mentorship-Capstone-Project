import { useState, useEffect } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";

import NavBar from "./components/Navbar";
import Post from "./components/Post";

import { GridRow, GridColumn, Grid } from "semantic-ui-react";

const Member = () => {
  const [user, setUser] = useState();
  const [info, setInfo] = useState("");
  const [posts, setPosts] = useState([]);
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
  async function Posts() {
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
    Auth();
    if (user && func === false) {
      Member2();
      setFunc(true);
    }
    Posts();
  }, [user, info]);

  return (
    <>
      {info && <NavBar info={info} />}
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
