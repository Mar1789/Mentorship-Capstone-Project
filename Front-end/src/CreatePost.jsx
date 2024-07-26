import { useState, useEffect } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";

import Container from "react-bootstrap/Container";
import { Dimmer, Loader } from "semantic-ui-react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const CreatePost = () => {
  const [user, setUser] = useState();
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const invalid = "Invalid Token";

  function handleSubmit(e) {
    setIsLoading(true);
    e.preventDefault();
    const form = e.target.form;
    const formData = new FormData(form);
    const title = formData.get("title");
    const text = formData.get("description");
    auth();
    fetch("https://mentorship-capstone-project.onrender.com/post", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        description: text,
        title: title,
        userId: info.id,
      }),
    }).then((data) =>
      data.json().then((data) => {
        e.target.form.reset();
        setIsLoading(false);
        window.location.href = "/member";
      })
    );
  }
  async function logOut() {
    const token = localStorage.getItem("accessToken");
    setIsLoading(true);
    await fetch("https://mentorship-capstone-project-auth-js.onrender.com/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((data) =>
      data.json().then((data) => {
        setIsLoading(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
      })
    );
  }

  async function auth() {
    setIsLoading(true);
    let token = localStorage.getItem("accessToken");
    await fetch("https://mentorship-capstone-project-auth-js.onrender.com/auth", {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((data) =>
      data.json().then((data) => {
        if (data === invalid) {
          token = localStorage.getItem("refreshToken");
          fetch("https://mentorship-capstone-project-auth-js.onrender.com/token", {
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
          setIsLoading(false);
        }
      })
    );
  }
  async function getInfo() {
    setIsLoading(true);
    await fetch(`https://mentorship-capstone-project.onrender.com/user/${user.name}`, {
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
  useEffect(() => {
    auth();
  }, []);
  useEffect(() => {
    if (user) {
      getInfo();
    }
  }, [user]);

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
              <Nav.Link className="link" href="/match-mentor">
                Match with a Mentor
              </Nav.Link>
              <Nav.Link className="link" href="/meetup">
                In-Person Meet-up
              </Nav.Link>
              <Nav.Link className="link" href="/create-post">
                Create a Post
              </Nav.Link>
              <Nav.Link className="link" href="/member">
                See Posts
              </Nav.Link>
              <Nav.Link className="link" href="/articles">
                Articles
              </Nav.Link>
              {info && (
                <NavDropdown
                  title={info.FirstName + " " + info.LastName}
                  id="collapsible-nav-dropdown"
                >
                  <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                  <NavDropdown.Item onClick={logOut}>Sign Out</NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Dimmer active={isLoading} inverted>
        <Loader inverted content="Loading" />
      </Dimmer>
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
