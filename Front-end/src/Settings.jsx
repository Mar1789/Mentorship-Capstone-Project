import { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";

import NavBar from "./components/Navbar";
import {
  Dimmer,
  Loader,
  CardMeta,
  CardHeader,
  CardDescription,
  CardContent,
  Card,
  Form,
  FormField,
  Button,
  Message,
} from "semantic-ui-react";

const Settings = () => {
  const [user, setUser] = useState();
  const [info, setInfo] = useState("");
  const [userError, setUserError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        if (data === "Invalid Token") {
          token = localStorage.getItem("refreshToken");
          fetch("https://mentorship-capstone-project-auth-js.onrender.com/token", {
            method: "POST",
            headers: {
              "Content-Type": "Application/json",
            },
            body: JSON.stringify({ token: token }),
          }).then((data) =>
            data.json().then((data) => {
              if (data === "Invalid Token") {
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

  async function userInfo() {
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
  function handleSubmit(e) {
    const userId = info.id;
    const form = e.target;
    const formData = new FormData(form);
    const firstName = formData.get("FirstName");
    const lastName = formData.get("LastName");
    const headline = formData.get("Headline");
    const role = formData.get("role");
    const age = formData.get("Age");
    const state = formData.get("state");
    const bookingLink = formData.get("bookingLink");
    setIsLoading(true);
    if (isNaN(parseInt(age))) {
      setIsLoading(true);
      return setUserError("Age must be a valid number!");
    }
    fetch(`https://mentorship-capstone-project.onrender.com/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        userId,
        firstName,
        lastName,
        headline,
        role,
        age,
        state,
        bookingLink,
      }),
    }).then((data) =>
      data.json().then((data) => {
        setUserError("");
        setIsLoading(false);
        userInfo();
        e.target.reset();
      })
    );
  }
  useEffect(() => {
    auth();
  }, []);
  useEffect(() => {
    if (user) {
      userInfo();
    }
  }, [user]);
  return (
    <>
      <NavBar info={info} />
      <h1>Settings</h1>
      <Dimmer active={isLoading} inverted>
        <Loader inverted content="Loading" />
      </Dimmer>
      <div className="settings">
        {info && (
          <Card className="settings-card">
            <img src="https://react.semantic-ui.com/images/avatar/large/matthew.png" />
            <CardContent>
              <CardHeader>{info.FirstName + " " + info.LastName}</CardHeader>
              <CardMeta></CardMeta>
              <CardDescription>{info.Headline}</CardDescription>
            </CardContent>
            <CardContent extra>{info.accountType}</CardContent>
            <CardContent extra>Age: {info.age}</CardContent>
            <CardContent extra>State: {info.state}</CardContent>
          </Card>
        )}
        {info && (
          <Form className="settings-form" onSubmit={handleSubmit}>
            <FormField>
              <label>First Name</label>
              <input
                name="FirstName"
                placeholder="First Name"
                defaultValue={info.FirstName}
                required
              />
              <label>Last Name</label>
              <input
                name="LastName"
                placeholder="Last Name"
                defaultValue={info.LastName}
                required
              />
              <label>Headline</label>
              <input
                name="Headline"
                placeholder="Headline"
                defaultValue={info.Headline}
                required
              />
              <label>Role</label>
              <select name="role" required>
                <option value="">Select a Role</option>
                <option value="Mentor">Mentor</option>
                <option value="Student">Student</option>
              </select>
              <label>Age</label>
              <input
                name="Age"
                placeholder="Age"
                min="18"
                defaultValue={info.age}
                required
              />
              <label>State</label>
              <select name="state" required>
                <option>Select a State</option>
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
              <label>Booking Link</label>
              <input
                type="url"
                name="bookingLink"
                placeholder="Enter your booking link"
                defaultValue={info.bookingLink}
                required
              />
            </FormField>
            <Button type="submit">Submit</Button>
          </Form>
        )}
        {userError && <Message error header={userError} />}
      </div>
    </>
  );
};

export default Settings;
