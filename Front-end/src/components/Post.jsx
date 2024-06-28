import "./Post.css";

const Post = () => {
  let logo =
    "Google’s interview process is long and arduous, seeming like a black box to many candidates. Not knowing what’s ahead makes it even harder to prepare. We’re here to help. We work with 50+ ex-Google interviewers on our platform, who have helped thousands of candidates navigate the Google interview process. Here’s what you need to know: Google’s interview process takes around one to two months, and there are seven steps: resume screen, recruiter call, phone screen(s), onsite interviews, hiring committee, team matching, and salary negotiation. The steps that will require the most preparation are the phone screens and onsite interviews. In the rest of this article, we’ll dive deep into each step and how you can prepare for it. Let’s get started.";
  logo = logo.substring(0, 164) + "...";

  return (
    <div className="post-border">
      <div className="profile">
        <img
          className="photo"
          src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg"
        />
        <p className="name">Jacob Pearson</p>
        <p className="accountType">Software Engineer @ M </p>
      </div>
      <h1 className="title">How to land a job at Google</h1>
      <h3>{logo}</h3>
      <div className="line"></div>
    </div>
  );
};
export default Post;
