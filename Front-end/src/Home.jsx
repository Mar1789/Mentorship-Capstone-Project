import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";

import { useState, useEffect } from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Companies from "../public/Big_Five_Tech_companies.png";

import { Slide } from "react-slideshow-image";
import { Dimmer, Loader, Image, Segment } from "semantic-ui-react";

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

const Home = () => {
  const [show, setShow] = useState(false);
  const [login, setLogin] = useState(true);
  const invalid = "Invalid Token";
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoad, setPageLoad] = useState(false);
  const [userError, setUserError] = useState("");

  const handleClose = () => setShow(false);
  function handleShow() {
    setShow(true);
    setLogin(true);
  }

  async function auth() {
    setPageLoad(true);
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
              if (data !== invalid) {
                setPageLoad(false);
                localStorage.setItem("accessToken", data);
              }
            })
          );
        } else {
          setPageLoad(false);
          window.location.href = "/member";
        }
      })
    );
  }

  function register() {
    if (login === true) {
      setLogin(false);
      return;
    } else {
      setLogin(true);
    }
  }
  function handleLogin(e) {
    setIsLoading(true);
    if (login === false) {
      handleRegister(e);
      return;
    }
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    if (login === true) {
      const username = formData.get("username");
      const password = formData.get("password");
      fetch("https://mentorship-capstone-project-auth-js.onrender.com/login", {
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
            setIsLoading(false);
            handleClose();
            window.location.href = "/member";
          } else {
            setUserError(data);
            setIsLoading(false);
          }
        })
      );
    }
    function handleRegister(e) {
      setIsLoading(true);
      const form = e.target;
      const formData = new FormData(form);
      const username = formData.get("username");
      const password = formData.get("password");
      const cpassword = formData.get("confirm-password");
      const firstName = formData.get("FirstName");
      const lastName = formData.get("LastName");
      const headline = formData.get("Headline");
      const role = e.target.querySelector("span.text").textContent;
      const age = formData.get("Age");
      const state = formData.get("state");
      const bookingLink = formData.get("bookingLink");
      if (isNaN(parseInt(age))) {
        return setUserError("Age must be a valid number!");
      }
      if (password !== cpassword) {
        return setUserError("Passwords do not match");
      }
      fetch("https://mentorship-capstone-project.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          FirstName: firstName,
          LastName: lastName,
          Headline: headline,
          accountType: role,
          age: age,
          state: state,
          bookingLink: bookingLink,
        }),
      }).then((data) =>
        data.json().then((data) => {
          if (data === "Account already exists! Change username") {
            setUserError("Account already exists! Change username");
          } else {
            setUserError("");
            setLogin(true);
            e.target.reset();
            setIsLoading(false);
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
    autoplay: true,
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
  useState(() => {
    auth();
  }, []);
  return (
    <>
      <Dimmer active={pageLoad} inverted>
        <Loader inverted content="Loading" />
      </Dimmer>
      <header>
        <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
          <Container>
            <Navbar.Brand href="/">PioneerPath</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
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
                <img className="water" src={slideImage} alt="sample" />
              </div>
            </div>
          ))}
        </Slide>
      </div>
      <hr className="slideline" />
      <p className="quote">
        Join a community of brillant students who want to break into the tech
        field
        <br />
        <br />
        Meet skilled mentors who want to help and give back to the community
        <br />
        <br />
        Join Today!
      </p>
      <div className="alumni">
        <h2>Where our Alumni are working after PioneerTech</h2>
        <img className="companylogo navbar-animation" src={Companies} />
      </div>

      <Modal show={show} onHide={handleClose}>
        <Dimmer active={isLoading} inverted>
          <Loader inverted content="Loading" />
        </Dimmer>
        <Modal.Header closeButton>
          <Modal.Title>{login ? "Login" : "Register"} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLogin}>
            <FormField>
              <label>Email</label>
              <FormInput
                type="email"
                name="username"
                placeholder="Email"
                required
              />
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
                <label>Age</label>
                <FormInput name="Age" placeholder="Age" min="18" required />
                <label>State</label>
                <select name="state" required>
                  <option value="" selected="selected">
                    Select a State
                  </option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="DC">District Of Columbia</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </select>
                <label>
                  Enter your booking link from
                  <a href="https://www.setmore.com/" target="_blank">
                    Setmore
                  </a>
                </label>
                <FormInput
                  type="url"
                  name="bookingLink"
                  placeholder="Setmore link"
                  required
                />
              </FormField>
            )}
            <Button type="submit">Submit</Button>
          </Form>
          <a href="/reset-password">Forgot Password?</a>
          {userError && <Message error header={userError} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={register}>
            {login
              ? "Don't have an account? Register here!"
              : "Already have an account? Sign In"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Home;
