import { useEffect, useState } from "react";
import "./Post.css";
import "semantic-ui-css/semantic.min.css";

import moment from "moment";
import { Icon, CommentGroup, Form } from "semantic-ui-react";
import Comment from "./sub-component/Comment";

const Post = (props) => {
  const [logo, setLogo] = useState("");
  const [date, setDate] = useState("");
  const [user, setUser] = useState([]);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [like, setLike] = useState("");
  const [seeLess, setSeeLess] = useState(false);
  const [likecount, setLikecount] = useState(0);
  const [commentcount, setCommentcount] = useState(0);

  function setLikes() {
    fetch(`http://localhost:3000/likeUser/${props.id}/${props.userid}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        if (data === 0) {
          setLike("heart outline");
        } else {
          setLike("heart");
        }
        getLikes();
      })
    );
  }
  function getLikes() {
    fetch(`http://localhost:3000/likes/${props.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setLikecount(data);
      })
    );
  }
  function author() {
    fetch(`http://localhost:3000/commentUser/${props.author}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setUser(data);
      })
    );
  }

  function handleLike() {
    if (like === "heart outline") {
      fetch(`http://localhost:3000/likes/${props.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ userId: props.userid }),
      }).then((data) =>
        data.json().then((data) => {
          setLike("heart");
        })
      );
    } else {
      fetch(`http://localhost:3000/likes/${props.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ userId: props.userid }),
      }).then((data) =>
        data.json().then((data) => {
          setLike("heart outline");
        })
      );
    }
  }

  function handleComment(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const comment = formData.get("comment-response");
    fetch(`http://localhost:3000/comment/${props.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ userId: props.userid, comment: comment }),
    }).then((data) =>
      data.json().then((data) => {
        getComments();
        commentCount();
        e.target.reset();
      })
    );
  }

  function getComments() {
    fetch(`http://localhost:3000/comments/${props.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setComments(data);
      })
    );
  }
  function commentCount() {
    fetch(`http://localhost:3000/commentcount/${props.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setCommentcount(data);
      })
    );
  }

  useEffect(() => {
    setLikes();
    author();
    setText(props.text);
    setLogo(props.text);
    commentCount();
    if (logo.length > 164) {
      setLogo(logo.substring(0, 164) + "...");
      setSeeLess(false);
    } else {
      setSeeLess(true);
    }
    getComments();
    const dates = new Date(props.date).toLocaleDateString();
    setDate(moment(new Date(dates)).format("MMMM D, Y"));
  }, [logo, like]);
  return (
    <>
      <div className="post-border">
        <div className="profile">
          <img
            className="photo"
            src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg"
            onClick={() => (window.location.href = `/profile-${user.id}`)}
          />
          <p
            className="name"
            onClick={() => (window.location.href = `/profile-${user.id}`)}
          >
            {user.FirstName + " " + user.LastName}
          </p>
          <p
            className="accountType"
            onClick={() => (window.location.href = `/profile-${user.id}`)}
          >
            {user.Headline}
          </p>
        </div>
        <h1 className="title">{props.title}</h1>
        <h3 className="p-description">
          {seeLess === true ? text : logo}
          {seeLess === false && (
            <a onClick={() => setSeeLess(true)}> See More</a>
          )}
        </h3>

        <footer>
          <p className="date">{date}</p>
          <p className="comments">💬{commentcount}</p>
          <Icon onClick={handleLike} className="like" name={like}>
            {likecount}
          </Icon>
        </footer>
        <hr />
      </div>
      <div className="comment-section">
        <h3>Comments</h3>
        <CommentGroup>
          {comments.map((comment) => (
            <Comment
              key={comment.comment_id}
              author={comment.userId}
              created={comment.createdAt}
              comment={comment.comment}
            />
          ))}
          <Form onSubmit={handleComment}>
            <label>Enter your comment here: </label>
            <input name="comment-response"></input>
          </Form>
        </CommentGroup>
      </div>
    </>
  );
};
export default Post;
