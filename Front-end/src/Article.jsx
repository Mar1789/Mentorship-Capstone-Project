import { useState, useEffect } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";

import Navbar from "./components/Navbar";
import ArticleComponent from "./components/ArticleComponent";
import { Dimmer, Loader, Grid } from "semantic-ui-react";

const Article = (props) => {
  const [user, setUser] = useState();
  const [info, setInfo] = useState("");
  const [article, setArticle] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function auth() {
    let token = localStorage.getItem("accessToken");
    setIsLoading(true);
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
          setIsLoading(false);
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
  async function getArticle() {
    setIsLoading(true);
    await fetch(`http://localhost:3000/article/${props.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setArticle(data);
        setIsLoading(false);
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
  useEffect(() => {
    getArticle();
  }, []);

  return (
    <>
      <Navbar info={info} />
      <br />
      <br />
      <Dimmer active={isLoading} inverted>
        <Loader inverted content="Loading" />
      </Dimmer>
      <div className="post-center">
        <Grid>
          {info && (
            <ArticleComponent
              userid={info.id}
              id={article.articleId}
              author={article.userId}
              date={article.createdAt}
              text={article.description}
              title={article.title}
              article={true}
            />
          )}
        </Grid>
        <p className="article-style">{article.description}</p>
      </div>
    </>
  );
};
export default Article;
