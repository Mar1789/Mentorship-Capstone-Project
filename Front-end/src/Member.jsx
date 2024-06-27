import { useState } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const Member = () => {
  const [user, setUser] = useState("");

  function Member() {
    fetch("http://localhost:3000/user", {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }).then((data) =>
      data.json().then((data) => {
        if (data === "Invalid Token") {
          window.location.href = "/";
        } else {
          setUser(data.username);
        }
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
  Member();
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
        <Container>
          <Navbar.Brand>Mentorship Website</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Our Mission</Nav.Link>
              <Nav.Link href="#link">Articles</Nav.Link>
              <Nav.Link>Log In</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <h1 className="welcome">Welcome: {user}</h1>
    </>
  );
};
export default Member;
