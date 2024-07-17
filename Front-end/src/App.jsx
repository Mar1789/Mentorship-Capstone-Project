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
import Settings from "./Settings";
import Article from "./Article";
import Articles from "./Articles";
import CreateArticle from "./CreateArticle";

function App() {
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
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
  async function getArticles() {
    await fetch("http://localhost:3000/articles", {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setArticles(data);
      })
    );
  }
  useEffect(() => {
    getUsers();
    getArticles();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/member" element={<Member />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/create-article" element={<CreateArticle />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/match-mentor" element={<MatchMentor />} />
        <Route path="/meetup" element={<Meetup />} />
        <Route path="/articles" element={<Articles />} />
        {users.map((user) => (
          <Route
            key={user.id}
            path={`/profile-${user.id}`}
            element={<Profile name={user.username} />}
          />
        ))}
        {articles.map((article) => (
          <Route
            key={article.articleId}
            path={`/article-${article.articleId}`}
            element={<Article id={article.articleId} />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
