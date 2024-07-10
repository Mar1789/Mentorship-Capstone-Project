import { useState, useEffect } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";

import NavBar from "./components/Navbar";
import {
  Form,
  FormField,
  FormSelect,
  FormInput,
  CardMeta,
  CardHeader,
  CardGroup,
  CardDescription,
  CardContent,
  Button,
  Card,
  Image,
} from "semantic-ui-react";

const MatchMentor = (props) => {
  const [date, setDate] = useState("");
  const [user, setUser] = useState();
  const [info, setInfo] = useState("");
  const [profile, setProfile] = useState();
  const [mentors, setMentors] = useState([]);
  const [func, setFunc] = useState(false);

  async function Auth() {
    let token = localStorage.getItem("accessToken");
    await fetch("http://localhost:4000/auth", {
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
              if (data === "Invalid Token") {
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
  async function LogOut() {
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
  async function Member2() {
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
  function Match(e) {
    let age;
    let state;
    let keyword;
    let users = [];
    const form = e.target;
    const formData = new FormData(form);
    age = formData.get("Age");
    state = formData.get("state");
    keyword = formData.get("interest");
    fetch(`http://localhost:3000/match/${age}/${state}/${keyword}:`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setMentors(data);
      })
    );
  }

  useEffect(() => {
    Auth();
    if (user && func === false) {
      Member2();
      setFunc(true);
    }
  }, [user, mentors]);
  return (
    <>
      {info && <NavBar info={info} />}
      <h1>Mentor Matching Search</h1>
      <div className="container">
        <Form onSubmit={Match}>
          <FormField>
            <label>Age</label>
            <select name="Age" placeholder="Age" min="18" required>
              <option value="">Select an age range</option>
              <option value="18-24">18+</option>
              <option value="18-24">18-24</option>
              <option value="25-30">25-30</option>
              <option value="30-38">30-38</option>
              <option value="38+">38+</option>
            </select>
            <label>State</label>
            <select name="state" required>
              <option value="">Select a State</option>
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
            <label>What interest you?</label>
            <input name="interest" placeholder="What interest you?" required />
            <button type="submit">Submit</button>
          </FormField>
          <CardGroup>
          {
          mentors.map((mentor, index) => (
                <Card className="card-align" key={index}>
                  <CardContent>
                    <Image
                      floated="right"
                      size="mini"
                      src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
                    />
                    <CardHeader>{mentor.FirstName} {mentor.LastName}</CardHeader>
                    <CardMeta>{mentor.Headline}</CardMeta>
                    <CardMeta>Located in {mentor.state}</CardMeta>
                    <CardDescription>X Followers</CardDescription>
                  </CardContent>
                  <CardContent extra>
                    <div className="ui two buttons">
                      <Button basic color="green">
                        Follow
                      </Button>
                      <Button basic color="red">
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
          ))}
          </CardGroup>
        </Form>
      </div>
    </>
  );
};

export default MatchMentor;
