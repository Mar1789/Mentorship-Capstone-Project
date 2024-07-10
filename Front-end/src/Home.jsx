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
      let Age;
      let State;
      const form = e.target;
      const formData = new FormData(form);
      username = formData.get("username");
      password = formData.get("password");
      cpassword = formData.get("confirm-password");
      FirstName = formData.get("FirstName");
      LastName = formData.get("LastName");
      Headline = formData.get("Headline");
      Role = e.target.querySelector("span.text").textContent;
      Age = formData.get("Age");
      State = formData.get("state");
      if (isNaN(parseInt(Age))) {
        return setUserError("Age must be a valid number!");
      }
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
          age: Age,
          state: State,
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
        <img
          className="companylogo"
          src={Companies}
          onLoad={(e) => (e.target.style.opacity = "1")}
        />
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
    </>
  );
};
export default Home;
