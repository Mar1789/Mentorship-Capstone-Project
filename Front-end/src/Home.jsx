import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";

import { useState, useEffect } from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FormField, Button, Checkbox, Form } from "semantic-ui-react";

import "./App.css";

const Home = () => {
  const [show, setShow] = useState(false);
  const [login, setLogin] = useState(true);

  const handleClose = () => setShow(false);
  function handleShow(){
      setShow(true);
      setLogin(true);
  }
  function Register(){
    if(login === true){
        setLogin(false);
    } else{
        setLogin(true);
    }
  }
  function handleSubmit(e){
    let username;
    let password;
    let cpassword // Comparison password
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    if(login === true){
        username = formData.get("username");
        password = formData.get("password");
        fetch("http://localhost:4000/login", {
            method: "POST",
            headers: {
              "Content-Type": "Application/json",
            },
            body: JSON.stringify({username: username, password: password})
          }).then((data) =>
            data.json().then((data) => {
              if(data.accessToken){
                localStorage.removeItem("accessToken")
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                handleClose();
                window.location.href = "/member"
              } else {
                window.alert(data);
              }
            })
          );    

    }

  }
  return (
    <>
      <header>
        <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
          <Container>
            <Navbar.Brand>Mentorship Website</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#home" >
                  Our Mission
                </Nav.Link>
                <Nav.Link href="#link" >
                  Articles
                </Nav.Link>
                <Nav.Link onClick={handleShow}>
                  Log In
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      {/* <Slideshow /> */}
      <img src="https://www.betterup.com/hubfs/Blog%20Images/Coach%20or%20mentor/coach-or-mentor%20woman%20talks%20to%20coach.jpg"/>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{login ? "Login" : "Register"} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <FormField>
              <label>Username</label>
              <input name="username" placeholder="Username" required/>
            </FormField>
            <FormField>
              <label>Password</label>
              <input name="password" placeholder="Password" required/>
            </FormField>
            {login ? null: 
            <FormField>
              <label>Confirm Password</label>
              <input name="confirm-password" placeholder="Confirm Password" required/>
            </FormField>}
            <FormField>
              <Checkbox label="I agree to the Terms and Conditions"  required/>
            </FormField>
            <Button type="submit">Submit</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={Register}>
          {login ? "Don't have an account? Register here!": "Already have an account? Sign In"}
          </Button>
        </Modal.Footer>
      </Modal>
      <h1 className="h1">TRESTM</h1>
    </>
  );
};
export default Home;
