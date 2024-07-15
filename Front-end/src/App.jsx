import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";
import Home from "./Home";
import Member from "./Member";
import CreatePost from "./CreatePost";
import Profile from "./Profile";
import MatchMentor from "./MatchMentor";
import Meetup from "./Meetup";

function App() {
  const [users, setUsers] = useState([]);
  async function getUsers() {
    await fetch("http://localhost:3000/users", {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setUsers(data);
      })
    );
  }
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/member" element={<Member />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/settings" element={<CreatePost />} />
        <Route path="/match-mentor" element={<MatchMentor />} />
        <Route path="/meetup" element={<Meetup />} />
        {users.map((user) => (
          <Route
            key={user.id}
            path={`/profile-${user.id}`}
            element={<Profile name={user.username} />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
