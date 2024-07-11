import { useState, useEffect } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const CreatePost = () => {
  const [user, setUser] = useState();
  const [info, setInfo] = useState("");
  const [func, setFunc] = useState(false);
  const invalid = "Invalid Token";

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

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target.form;
    const formData = new FormData(form);
    const title = formData.get("title");
    const text = formData.get("description");
    Auth();
    fetch("http://localhost:3000/post", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ description: text, title: title, id: info.id }),
    }).then((data) =>
      data.json().then((data) => {
        e.target.form.reset();
        window.location.href = "/member";
      })
    );
  }
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
  useEffect(() => {
    auth();
    if (user && func === false) {
      member2();
      setFunc(true);
    }
  }, [user, info]);

  return (
    <div className="margin">
      <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
        <Container>
          <Navbar.Brand href="/">PioneerPath</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <button
                className="post"
                onClick={handleSubmit}
                form="Create-Post"
              >
                Submit post
              </button>
              <Nav.Link className="link" href="#link">
                Articles
              </Nav.Link>
              <NavDropdown
                title={info.FirstName + " " + info.LastName}
                id="collapsible-nav-dropdown"
              >
                <NavDropdown.Item onClick={logOut}>Sign Out</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.1">Settings</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <form id="Create-Post">
        <h1>Make a post</h1>
        <br />
        <textarea
          placeholder="Title"
          name="title"
          type="search"
          className="post-search"
        ></textarea>
        <br />
        <br />
        <textarea
          name="description"
          placeholder="Write your story here:"
          type="Search"
          className="post-description"
        ></textarea>
      </form>
    </div>
  );
};

export default CreatePost;
