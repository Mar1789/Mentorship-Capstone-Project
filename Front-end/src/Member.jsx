import { useState, useEffect } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Post from "./components/Post";

import { GridRow, GridColumn, Grid } from "semantic-ui-react";

const Member = () => {
  const [user, setUser] = useState();
  const [info, setInfo] = useState("");
  const [posts, setPosts] = useState([]);
  const [func, setFunc] = useState(false);

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
  async function logOut() {
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
    if (user && func === false) {
      member2();
      setFunc(true);
    }
    getPosts();
  }, [user, info]);

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
        <Container>
          <Navbar.Brand href="/">PioneerPath</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Nav.Link className="link" href="/create-post">
                Create a Post
              </Nav.Link>
              <Nav.Link className="link" href="#link">
                Articles
              </Nav.Link>
              <NavDropdown
                title={info.FirstName + " " + info.LastName}
                id="collapsible-nav-dropdown"
              >
                <NavDropdown.Item>Settings</NavDropdown.Item>
                <NavDropdown.Item onClick={logOut}>Sign Out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
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
