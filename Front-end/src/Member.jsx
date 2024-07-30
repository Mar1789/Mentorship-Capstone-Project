import { useState, useEffect } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";

import Navbar from "./components/Navbar";
import Post from "./components/Post";

import {
  Dimmer,
  Loader,
  GridRow,
  GridColumn,
  Grid,
  DropdownMenu,
  DropdownItem,
  DropdownHeader,
  DropdownDivider,
  Dropdown,
  Form,
  Input,
} from "semantic-ui-react";

const Member = () => {
  const [user, setUser] = useState();
  const [info, setInfo] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function auth() {
    let token = localStorage.getItem("accessToken");
    setIsLoading(true);
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
  async function getPosts() {
    setIsLoading(true);
    await fetch("https://mentorship-capstone-project.onrender.com/posts", {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setPosts(data);
        setIsLoading(false);
      })
    );
  }
  async function filterPosts(e) {
    setIsLoading(true);
    await fetch(
      `https://mentorship-capstone-project.onrender.com/filterPosts/${e.target.innerText}/${info.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "Application/json",
        },
      }
    ).then((data) =>
      data.json().then((data) => {
        setPosts(data);
        setIsLoading(false);
        console.log(data);
      })
    );
  }
  useEffect(() => {
    auth();
  }, []);
  useEffect(() => {
    setIsLoading(true);
    if (user) {
      getInfo();
      getPosts();
    }
  }, [user]);
  const tagOptions = [
    {
      key: "Following",
      text: "Following",
      value: "Following",
      label: { color: "red", empty: true, circular: true },
    },
    {
      key: "Most Oldest",
      text: "Most Oldest",
      value: "Most Oldest",
      label: { color: "black", empty: true, circular: true },
    },
    {
      key: "Most Recent",
      text: "Most Recent",
      value: "Most Recent",
      label: { color: "blue", empty: true, circular: true },
    },
  ];
  return (
    <>
      <Navbar info={info} />
      {info && (
        <div>
          <br />
          <Dropdown
            placeholder="Filter"
            icon="filter"
            floating
            labeled
            button
            className="icon filter"
          >
            <DropdownMenu>
              <DropdownMenu scrolling>
                {tagOptions.map((option) => (
                  <DropdownItem
                    onClick={filterPosts}
                    key={option.value}
                    {...option}
                  />
                ))}
              </DropdownMenu>
            </DropdownMenu>
          </Dropdown>
          <br /> <br /> <br /> <br />
        </div>
      )}
      <div className="post-center">
        <Dimmer active={isLoading} inverted>
          <Loader inverted content="Loading" />
        </Dimmer>
        <Grid divided="vertically" className="sizing">
          {info &&
            posts.map((post) => (
              <GridRow columns={1} key={post.Post_id} className="animation">
                <GridColumn className="hover">
                  <Post
                    userid={info.id}
                    id={post.Post_id}
                    author={post.userId}
                    date={post.createdAt}
                    text={post.description}
                    title={post.title}
                    fetch={getPosts}
                  />
                </GridColumn>
              </GridRow>
            ))}
        </Grid>
      </div>
    </>
  );
};
export default Member;
