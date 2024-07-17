import { useState, useEffect } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";

import Navbar from "./components/Navbar";
import ArticleComponent from "./components/ArticleComponent";
import { Grid } from "semantic-ui-react";

const Articles = () => {
  const [user, setUser] = useState();
  const [info, setInfo] = useState("");
  const [articles, setArticles] = useState([]);

  async function auth() {
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
              if (data === "Invalid Token" || data === "FAILED") {
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

  async function getInfo() {
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
  async function getArticles() {
    await fetch(`http://localhost:3000/articles/${info.id}`, {
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
    auth();
    if (user) {
      getInfo();
    }
    if (info) {
      getArticles();
    }
  }, [user]);

  return (
    <>
      <Navbar info={info} />
      {info && <h1 className="welcome">Articles:</h1>}
      <button onClick={() => (window.location.href = "/create-article")}>
        Create an article
      </button>

      <div className="post-center">
        <Grid divided="vertically" className="sizing">
          {info &&
            articles.map((article) => (
              <ArticleComponent
                key={article.articleId}
                userid={info.id}
                id={article.articleId}
                author={article.userId}
                date={article.createdAt}
                text={article.description}
                title={article.title}
                article={false}
              />
            ))}
        </Grid>
      </div>
    </>
  );
};
export default Articles;
