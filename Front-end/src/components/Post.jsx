import { useEffect, useState } from "react";
import "./Post.css";
import moment from "moment";
import { Icon } from "semantic-ui-react";

const Post = (props) => {
  const [logo, setLogo] = useState("");
  const [date, setDate] = useState("");
  const [user, setUser] = useState([]);
  const [like, setLike] = useState("");
  const [likecount, setLikecount] = useState(0);

  function SetLike() {
    // userid = User ID of logged in
    // .id = ID of the post
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
        GetLikes();
      })
    );
  }
  function GetLikes() {
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
  function Author() {
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

  useEffect(() => {
    SetLike();
    Author();
    setLogo(props.text);
    if (logo.length > 164) {
      setLogo(logo.substring(0, 164) + "...");
    }
    let dates = new Date(props.date).toLocaleDateString();
    setDate(moment(new Date(dates)).format("MMMM D, Y"));
  }, [logo, like]);
  return (
    <div className="post-border">
      <div className="profile">
        <img
          className="photo"
          src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg"
        />
        <p className="name">{user.FirstName + " " + user.LastName}</p>
        <p className="accountType">{user.Headline}</p>
      </div>
      <h1 className="title">{props.title}</h1>
      <h3 className="description">{logo}</h3>
      <img
        className="thumbnail-image"
        src="https://cdn.sanity.io/images/oaglaatp/production/c7c17eecf2f0e103ef0b6b098bae16bf7ad6bdee-1200x800.png?w=1200&h=800&auto=format"
      />
      <p className="date">{date}</p>
      <p className="comments">💬6</p>
      <Icon onClick={handleLike} className="like" name={like}>
        {likecount}
      </Icon>
    </div>
  );
};
export default Post;
