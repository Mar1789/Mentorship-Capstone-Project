import { useEffect, useState } from "react";
import "./Post.css";
import "semantic-ui-css/semantic.min.css";

import moment from "moment";
import {
  Dimmer,
  Loader,
  Button,
  Icon,
  CommentGroup,
  Form,
} from "semantic-ui-react";
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
  const [isLoading, setIsLoading] = useState(false);

  function setLikes() {
    setIsLoading(true);
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
        setIsLoading(false);
      })
    );
  }
  function getLikes() {
    setIsLoading(true);
    fetch(`http://localhost:3000/likes/${props.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setLikecount(data);
        setIsLoading(false);
      })
    );
  }
  function author() {
    setIsLoading(true);
    fetch(`http://localhost:3000/commentUser/${props.author}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setUser(data);
        setIsLoading(false);
      })
    );
  }

  function handleLike() {
    setIsLoading(true);
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
          setIsLoading(false);
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
          setIsLoading(false);
        })
      );
    }
  }

  function handleComment(e) {
    setIsLoading(true);
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
        setIsLoading(false);
        e.target.reset();
      })
    );
  }
  function deletePost() {
    setIsLoading(true);
    fetch(`http://localhost:3000/post`, {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ Post_id: props.id }),
    }).then((data) =>
      data.json().then((data) => {
        props.fetch("Delete Post");
        setIsLoading(false);
      })
    );
  }

  function getComments() {
    setIsLoading(true);
    fetch(`http://localhost:3000/comments/${props.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setComments(data);
        setIsLoading(false);
      })
    );
  }
  function commentCount() {
    setIsLoading(true);
    fetch(`http://localhost:3000/commentcount/${props.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setCommentcount(data);
        setIsLoading(false);
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
      <Dimmer active={isLoading} inverted>
        <Loader inverted content="Loading" />
      </Dimmer>
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
          {user.id === props.userid && (
            <Button icon className="delete" color="red" onClick={deletePost}>
              <Icon name="trash alternate"></Icon>
            </Button>
          )}
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
