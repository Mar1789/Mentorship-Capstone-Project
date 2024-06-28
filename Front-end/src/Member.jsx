import { useState, useEffect } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Post from "./components/Post";

const Member = () => {
  const [user, setUser] = useState("");

  function Auth() {
    let token = localStorage.getItem("accessToken");
    fetch("http://localhost:4000/auth", {
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
                localStorage.setItem("accessToken", data);
                console.log(localStorage.getItem("accessToken"));
            })
          );
        }
      })
    );
  }

  function Member() {
    const token = localStorage.getItem("accessToken");
    fetch("http://localhost:3000/user", {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((data) =>
      data.json().then((data) => {
        console.log(data);
        setUser(data.username);
      })
    );
  }
  function posts() {
    fetch("http://localhost:3000/posts", {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    }).then((data) =>
      data.json().then((data) => {
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          handleClose();
          window.location.href = "/member";
        }
      })
    );
  }
  useEffect(() => {
    Auth();
    Member();
  });
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
        <Container>
          <Navbar.Brand href="/">PioneerPath</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* <Nav.Link href="/">Home</Nav.Link> */}
              <Nav.Link href="#link">Articles</Nav.Link>
              <Nav.Link>{user}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <h1 className="welcome">Welcome: {user}</h1>
      <Post />
    </>
  );
};
export default Member;