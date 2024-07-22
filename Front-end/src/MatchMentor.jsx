import { useState, useEffect } from "react";
import "./App.css";

import "semantic-ui-css/semantic.min.css";

import NavBar from "./components/Navbar";
import {
  Dimmer,
  Loader,
  Form,
  FormField,
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
  const [user, setUser] = useState();
  const [info, setInfo] = useState("");
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const invalid = "Invalid Token";

  async function auth() {
    setIsLoading(true);
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
          setIsLoading(false);
          setUser(data);
        }
      })
    );
  }

  async function getInfo() {
    setIsLoading(true);
    await fetch(`http://localhost:3000/user/${user.name}`, {
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
  function match(e) {
    setIsLoading(true);
    const form = e.target;
    const formData = new FormData(form);
    const age = formData.get("Age");
    const keyword = formData.get("interest");
    fetch(`http://localhost:3000/match/${info.id}/${age}/${keyword}:`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setIsLoading(false);
        setMentors(data);
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
    <>
      {info && <NavBar info={info} />}
      <h1>Mentor Matching Search</h1>
      <Dimmer active={isLoading} inverted>
        <Loader inverted content="Loading" />
      </Dimmer>
      <div className="container">
        {info && (
          <Form onSubmit={match}>
            <FormField>
              <label>Age</label>
              <select name="Age" placeholder="Age" min="18" required>
                <option value="">Select an age range</option>
                <option value="18+">18+</option>
                <option value="18-24">18-24</option>
                <option value="25-30">25-30</option>
                <option value="30-38">30-38</option>
                <option value="38+">38+</option>
                <label>What interest you?</label>
              </select>
              <br />
              <select
                name="interest"
                placeholder="What interest you?"
                min="18"
                required
              >
                <option value="">Select an interest</option>
                <option value="SWE">Software Engineering</option>
                <option value="Nuclear Engineer">Nuclear Engineering</option>
                <option value="Industrial Engineer">
                  Industrial Engineering
                </option>
                <option value="Data Engineer">Data Engineering</option>
                <option value="Product Manager">Product Management</option>
                <option value="Civil Engineer">Civil Engineering</option>
              </select>{" "}
              <button type="submit">Submit</button>
            </FormField>
            <CardGroup>
              {mentors &&
                mentors.map((mentor, index) => (
                  <Card className="card-align" key={index}>
                    <CardContent>
                      <Image
                        floated="right"
                        size="mini"
                        src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
                      />
                      <CardHeader>
                        {mentor.FirstName} {mentor.LastName}
                      </CardHeader>
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
        )}
      </div>
    </>
  );
};

export default MatchMentor;
