import { useEffect, useState } from "react";
import "./Post.css";
import moment from "moment";

const Post = (props) => {
  const [logo, setLogo] = useState("");
  const [date, setDate] = useState("");
  const [user, setUser] = useState([]);
  function Author() {
    fetch(`http://localhost:3000/commentUser/${props.id}`, {
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

  useEffect(() => {
    Author();
    setLogo(props.text);
    if (logo.length > 164) {
      setLogo(logo.substring(0, 164) + "...");
    }
    let dates = new Date(props.date).toLocaleDateString();
    setDate(moment(new Date(dates)).format("MMMM D, Y"));
  }, [date, logo, user]);
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
    </div>
  );
};
export default Post;
