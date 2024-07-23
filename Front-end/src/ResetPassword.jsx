import { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";

import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import {
  Message,
  Form,
  FormField,
  FormInput,
  Dimmer,
  Loader,
} from "semantic-ui-react";

const ResetPassword = () => {
  const [accountId, setAccountId] = useState("");
  const [userError, setUserError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verify, setVerify] = useState(false);
  const [newPassword, setNewPassword] = useState(false);

  function handleSubmit(e) {
    setIsLoading(true);
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get("email");
    fetch(`http://localhost:3000/resetPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ email }),
    }).then((data) =>
      data.json().then((data) => {
        if (data === "Account not found with associated email") {
          setUserError(data);
          setIsLoading(false);
        } else {
          setUserError("");
          setVerify(true);
          setIsLoading(false);
          e.target.reset();
        }
      })
    );
  }
  function handleVerify(e) {
    setIsLoading(true);
    const form = e.target;
    const formData = new FormData(form);
    const resetCode = formData.get("code");

    fetch(`http://localhost:3000/verifyCode/${resetCode}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        if (data === "EXPIRED CODE" || data === "INVALID CODE") {
          setUserError(data);
        } else {
          setNewPassword(true);
          setVerify(true);
          setAccountId(data);
          e.target.reset();
        }
        setIsLoading(false);
      })
    );
  }
  function handlePassword(e) {
    setIsLoading(true);
    const form = e.target;
    const formData = new FormData(form);
    const password = formData.get("password");
    const cpassword = formData.get("cpassword");
    if (password === cpassword) {
      fetch(`http://localhost:3000/changePassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ userId: accountId, password }),
      }).then((data) =>
        data.json().then((data) => {
          setNewPassword(true);
          setIsLoading(false);
          window.location.href = "/";
          e.target.reset();
        })
      );
    } else {
      setUserError("PASSWORDS DO NOT MATCH");
      setIsLoading(false);
    }
  }
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
        <Container>
          <Navbar.Brand href="/">PioneerPath</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end"></Navbar.Collapse>
        </Container>
      </Navbar>
      <Dimmer active={isLoading} inverted>
        <Loader inverted content="Loading" />
      </Dimmer>
      <div className="resetPassword">
        {!verify && !newPassword && (
          <Form onSubmit={handleSubmit}>
            <h1 className="resetPassword-title">Reset Password</h1>
            <FormField className="resetPassword-form">
              <FormInput
                type="email"
                name="email"
                placeholder="Enter your Email Address"
                required
              ></FormInput>
            </FormField>
            <button>Submit</button>
          </Form>
        )}
        {verify && !newPassword && (
          <Form onSubmit={handleVerify}>
            <h1 className="resetPassword-title">Reset Password</h1>
            <FormField className="resetPassword-form">
              <p>
                Enter the verification code that was sent to your email. The
                code will expire in 5 minutes
              </p>
              <FormInput
                type="code"
                name="code"
                placeholder="Enter your verification code"
                required
              ></FormInput>
            </FormField>
            <button>Submit</button>
          </Form>
        )}
        {newPassword && (
          <Form onSubmit={handlePassword}>
            <h1 className="resetPassword-title">Reset Password</h1>
            <FormField className="resetPassword-form">
              <p>Enter your new password</p>
              <FormInput
                type="password"
                name="password"
                placeholder="Enter your password"
                required
              ></FormInput>
              <FormInput
                type="password"
                name="cpassword"
                placeholder="Confirm your password"
                required
              ></FormInput>
            </FormField>
            <button>Submit</button>
          </Form>
        )}
        {userError && (
          <Message className="resetPassword-form" error header={userError} />
        )}
      </div>
    </>
  );
};

export default ResetPassword;
