import { useEffect, useState } from "react";
import "./Post.css";
import "semantic-ui-css/semantic.min.css";
import { Dimmer, Loader } from "semantic-ui-react";

import moment from "moment";

const ArticleComponent = (props) => {
  const [logo, setLogo] = useState("");
  const [date, setDate] = useState("");
  const [user, setUser] = useState([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function author() {
    setIsLoading(true);
    fetch(`https://mentorship-capstone-project.onrender.com/commentUser/${props.author}`, {
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
  function userProfile(e) {
    e.stopPropagation();
    window.location.href = `/profile-${user.id}`;
  }

  useEffect(() => {
    author();
    setText(props.text);
    setLogo(props.text);
    if (logo.length > 164) {
      setLogo(logo.substring(0, 164) + "...");
    } else {
    }
    const dates = new Date(props.date).toLocaleDateString();
    setDate(moment(new Date(dates)).format("MMMM D, Y"));
  }, [logo]);
  return (
    <div className="border-article">
      <Dimmer active={isLoading} inverted>
        <Loader inverted content="Loading" />
      </Dimmer>
      <div
        className="post-border"
        onClick={() => (window.location.href = `/article-${props.id}`)}
      >
        <div>
          <div className="profile">
            <img
              className="photo"
              src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg"
              onClick={userProfile}
            />
            <p className="name" onClick={userProfile}>
              {user.FirstName + " " + user.LastName}
            </p>
            <p className="accountType" onClick={userProfile}>
              {user.Headline}
            </p>
          </div>
          <h1 className="title">{props.title}</h1>
          {props.article === false && <h3 className="p-description">{logo}</h3>}
          <div className="footer">
            <p className="date">{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ArticleComponent;
