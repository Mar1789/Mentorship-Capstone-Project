import {
  CommentText,
  Icon,
  CommentMetadata,
  CommentGroup,
  CommentContent,
  CommentAvatar,
  CommentAuthor,
  Form,
  Comment,
} from "semantic-ui-react";
import { useState, useEffect } from "react";
import moment from "moment";

const Comments = (props) => {
  const [date, setDate] = useState();
  const [comment, setComment] = useState([]);

  function CommentAuthors() {
    fetch(`http://localhost:3000/commentUser/${props.author}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    }).then((data) =>
      data.json().then((data) => {
        setComment(data);
      })
    );
  }
  useEffect(() => {
    CommentAuthors();
    let dates = new Date(props.created).toLocaleDateString();
    setDate(moment(new Date(dates)).format("MMMM D, Y"));
  }, []);

  return (
    <Comment>
      <CommentAvatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
      <CommentContent>
        <CommentAuthor as="a" onClick={() => window.location.href=`/profile-${comment.id}`}>
          {comment.FirstName + " " + comment.LastName}
        </CommentAuthor>
        <CommentMetadata>
          <div>{date}</div>
        </CommentMetadata>
        <CommentText>{props.comment}</CommentText>
      </CommentContent>
    </Comment>
  );
};

export default Comments;
