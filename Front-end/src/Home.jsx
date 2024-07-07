import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";

import { useState, useEffect } from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Companies from "../public/Big_Five_Tech_companies.png"

import { Slide } from "react-slideshow-image";

import {
  FormField,
  FormInput,
  FormSelect,
  Button,
  Checkbox,
  Message,
  Form,
} from "semantic-ui-react";

import "react-slideshow-image/dist/styles.css";
import "./App.css";
// import "./components/slide.css"

const Home = () => {
  const [show, setShow] = useState(false);
  const [login, setLogin] = useState(true);
  const [userError, setUserError] = useState("");

  const handleClose = () => setShow(false);
  function handleShow() {
    setShow(true);
    setLogin(true);
  }
  function Register() {
    if (login === true) {
      setLogin(false);
      return;
    } else {
      setLogin(true);
    }
  }
  function handleLogin(e) {
    if (login === false) {
      handleRegister(e);
      return;
    }
    let username;
    let password;
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    if (login === true) {
      username = formData.get("username");
      password = formData.get("password");
      fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      }).then((data) =>
        data.json().then((data) => {
          if (data.accessToken) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            setUserError("");
            handleClose();
            window.location.href = "/member";
          } else {
            setUserError(data);
          }
        })
      );
    }
    function handleRegister(e) {
      let username;
      let password;
      let cpassword; // Comparison password
      let FirstName;
      let LastName;
      let Role;
      let Headline;
      const form = e.target;
      const formData = new FormData(form);
      username = formData.get("username");
      password = formData.get("password");
      cpassword = formData.get("confirm-password");
      FirstName = formData.get("FirstName");
      LastName = formData.get("LastName");
      Headline = formData.get("Headline");
      Role = e.target.querySelector("span.text").textContent;

      if (password !== cpassword) {
        return setUserError("Passwords do not match");
      }
      fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          FirstName: FirstName,
          LastName: LastName,
          Headline: Headline,
          accountType: Role,
        }),
      }).then((data) =>
        data.json().then((data) => {
          if (data === "Account already exists! Change username") {
            setUserError("Account already exists! Change username");
          } else {
            setUserError("");
            setLogin(true);
            e.target.reset();
          }
        })
      );
    }
  }
  const options = [
    { key: "Mentor", text: "Mentor", value: "Mentor" },
    { key: "Student", text: "Student", value: "Student" },
  ];

  const properties = {
    duration: 2000,
    autoplay: false,
    transitionDuration: 900,
    arrows: false,
    infinite: true,
    easing: "ease",
    indicators: true,
  };
  const slideImages = [
    "https://cdn.careerfoundry.com/en/wp-content/uploads/old-blog-uploads/mentorship-uxdesign-programs.jpg",
    "https://mae.ufl.edu/wp-content/uploads/2020/07/group-1024x682.jpg",
    "https://shpeuf.s3.amazonaws.com/public/home/home-2.jpg",
  ];
  return (
    <>
      <header>
        <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
          <Container>
            <Navbar.Brand href="/">PioneerPath</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Nav>
                <Nav.Link href="#home">Our Mission</Nav.Link>
                <Nav.Link href="#link">Articles</Nav.Link>
              </Nav>
              <Navbar.Text onClick={handleShow}>Log In</Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      
      <div className="slideshowImage">
        <Slide {...properties}>
          {slideImages.map((slideImage, index) => (
            <div key={index}>
              <div key={index} className="each-slide">
                <img className="water" src={slideImage} alt="sample"/>
              </div>
            </div>
          ))}
        </Slide>
      </div>
      <hr className="slideline"/>
      <p className="quote">
        Join a community of brillant students who want to break into the tech field
        <br/>
        <br/>
        Meet skilled mentors who want to help and give back to the community
        <br/>
        <br/>
        Join Today!
      </p>
      <div className="alumni">
        <h2>Where our Alumni are working after PioneerTech</h2>
      <img className="companylogo" src={Companies} onLoad={((e) => e.target.style.opacity="1")}/>
      </div>


      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{login ? "Login" : "Register"} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLogin}>
            <FormField>
              <label>Username</label>
              <FormInput name="username" placeholder="Username" required />
            </FormField>
            <FormField>
              <label>Password</label>
              <FormInput
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </FormField>
            {login ? null : (
              <FormField>
                <label>Confirm Password</label>
                <FormInput
                  type="password"
                  name="confirm-password"
                  placeholder="Confirm Password"
                  required
                />
                <label>First Name</label>
                <FormInput name="FirstName" placeholder="First Name" required />
                <label>Last Name</label>
                <FormInput name="LastName" placeholder="Last Name" required />
                <label>Headline</label>
                <FormInput name="Headline" placeholder="Headline" required />
                <label>Role</label>
                <FormSelect
                  name="role"
                  placeholder="Role"
                  options={options}
                  required
                />
              </FormField>
            )}
            <Button type="submit">Submit</Button>
          </Form>
          {userError && <Message error header={userError} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={Register}>
            {login
              ? "Don't have an account? Register here!"
              : "Already have an account? Sign In"}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <h1 className="h1">Welcome to PioneerPath!</h1> */}
    </>
  );
};
export default Home;
