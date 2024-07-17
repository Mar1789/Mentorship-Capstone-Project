const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const similarity = require("similarity");
const app = express();

const saltRounds = 11;
let salt;
const PORT = 3000;
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is Running: ${PORT}`);
});
app.delete("/likes/:id", async (req, res) => {
  const postId = parseInt(req.params.id);
  const UserId = parseInt(req.body.userId);
  const count = await prisma.like.count({
    where: {
      Post_id: postId,
      userId: UserId,
    },
  });
  if (count === 1) {
    const like = await prisma.like.deleteMany({
      where: {
        Post_id: postId,
        userId: UserId,
      },
    });
    res.json(like);
  } else {
    res.json("User already deleted. Sorry!");
  }
});
app.delete("/follow/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const followerId = parseInt(req.body.followId);
  const count = await prisma.follow.count({
    where: {
      followerId: followerId,
      userId: userId,
    },
  });
  if (count === 1) {
    const follow = await prisma.follow.deleteMany({
      where: {
        followerId: followerId,
        userId: userId,
      },
    });
    res.json(follow);
  } else {
    res.json("User already deleted. Sorry!");
  }
});

app.post("/likes/:id", async (req, res) => {
  const postId = parseInt(req.params.id);
  const UserId = parseInt(req.body.userId);
  const count = await prisma.like.count({
    where: {
      Post_id: postId,
      userId: UserId,
    },
  });
  if (count === 0) {
    const like = await prisma.like.create({
      data: {
        userId: UserId,
        Post_id: postId,
      },
    });
    res.json(like);
  } else {
    res.json("User already liked. Sorry!");
  }
});
app.post("/follow/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const followerId = parseInt(req.body.followId);
  const count = await prisma.follow.count({
    where: {
      followerId: followerId,
      userId: userId,
    },
  });
  if (count === 0) {
    const follow = await prisma.follow.create({
      data: {
        followerId: followerId,
        userId: userId,
      },
    });
    res.json(follow);
  } else {
    res.json("User already liked. Sorry!");
  }
});
app.get("/likeUser/:id/:user", async (req, res) => {
  const postId = parseInt(req.params.id);
  const UserId = parseInt(req.params.user);
  const count = await prisma.like.count({
    where: {
      Post_id: postId,
      userId: UserId,
    },
  });
  res.json(count);
});
app.get("/followUser/:follower/:user", async (req, res) => {
  const followerId = parseInt(req.params.follower);
  const userId = parseInt(req.params.user);
  const count = await prisma.follow.count({
    where: {
      followerId: followerId,
      userId: userId,
    },
  });
  res.json(count);
});
app.get("/likes/:id", async (req, res) => {
  const postId = req.params.id;
  const likes = await prisma.like.count({
    where: {
      Post_id: parseInt(postId),
    },
  });
  res.json(likes);
});
app.get("/followers/:id", async (req, res) => {
  const userId = req.params.id;
  const followers = await prisma.follow.count({
    where: {
      userId: parseInt(userId),
    },
  });
  res.json(followers);
});

app.get("/commentcount/:id", async (req, res) => {
  const postId = req.params.id;
  const commentCount = await prisma.comments.count({
    where: {
      Post_id: parseInt(postId),
    },
  });
  res.json(commentCount);
});

app.get("/posts", async (req, res) => {
  const userId = res.locals.id;
  const posts = await prisma.posts.findMany({
    where: {
      userId: userId,
    },
  });
  res.json(posts);
});
app.post("/post", async (req, res) => {
  const { description, title, userId } = req.body;
  const post = await prisma.posts.create({
    data: {
      userId: id,
      description: description,
      title: title,
    },
  });
  res.json(post);
});

app.get("/articles", async (req, res) => {
  const userId = req.body.userId;
  const posts = await prisma.articles.findMany({
    where: {
      userId: parseInt(userId),
    },
  });
  res.json(posts);
});

app.post("/article", async (req, res) => {
  const { description, title, userId } = req.body;
  const post = await prisma.articles.create({
    data: {
      userId: parseInt(userId),
      description: description,
      title: title,
    },
  });
  res.json(post);
});

app.get("/users", async (req, res) => {
  const user = await prisma.User.findMany();
  res.json(user);
});

app.put("/user", async (req, res) => {
  const { userId, firstName, lastName, headline, role, age, state } = req.body;
  const updateUser = await prisma.User.update({
    where: {
      id: parseInt(userId),
    },
    data: {
      FirstName: firstName,
      LastName: lastName,
      Headline: headline,
      accountType: role,
      age: parseInt(age),
      state: state,
    },
  });
  res.json(updateUser);
});
app.get("/mentors", async (req, res) => {
  const mentors = await prisma.User.findMany({
    where: {
      accountType: "Mentor",
    },
  });
  res.json(mentors);
});

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await prisma.User.findFirst({
    where: {
      username: userId,
    },
  });
  res.json(user);
});

app.get("/comments/:id", async (req, res) => {
  const PostId = req.params.id;
  const comments = await prisma.comments.findMany({
    where: {
      Post_id: parseInt(PostId),
    },
  });
  res.json(comments);
});

app.post("/comment/:id", async (req, res) => {
  const PostId = req.params.id;
  const { userId, comment } = req.body;
  const newComment = await prisma.comments.create({
    data: {
      userId: parseInt(userId),
      Post_id: parseInt(PostId),
      comment: comment,
    },
  });
  res.json(newComment);
});

app.get("/commentUser/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await prisma.User.findFirst({
    where: {
      id: parseInt(userId),
    },
  });
  res.json(user);
});

app.post("/register", async (req, res) => {
  let {
    username,
    password,
    Headline,
    FirstName,
    LastName,
    accountType,
    age,
    state,
  } = req.body;
  const account = await prisma.User.findFirst({
    where: {
      username: username,
    },
  });
  if (account) {
    return res.json("Account already exists! Change username");
  } else {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        return;
      }
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return;
        }
        password = hash;
        const user = await prisma.User.create({
          data: {
            username,
            password,
            Headline,
            FirstName,
            LastName,
            accountType,
            age: parseInt(age),
            state,
          },
        });
        res.json(user);
      });
    });
  }
});
app.get("/coordinates/:id", async (req, res) => {
  const userId = req.params.id;
  const count = await prisma.coord.count({
    where: {
      userId: parseInt(userId),
    },
  });
  if (count != 0) {
    const coords = await prisma.coord.findMany({
      where: {
        userId: parseInt(userId),
      },
    });
    res.json(coords);
  } else {
    res.json("User has has not shared their location!");
  }
});

app.post("/coordinates", async (req, res) => {
  const { userId, longitude, latitude } = req.body;
  const removedCoords = await prisma.coord.deleteMany({
    where: {
      userId: parseInt(userId),
    },
  });
  const coordinates = await prisma.coord.create({
    data: {
      userId: parseInt(userId),
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
    },
  });
  res.json(coordinates);
});

app.get("/match/:age/:state/:keyword", async (req, res) => {
  let users = [];
  let matches = [];
  let results;
  let map1 = new Map();
  const senior = "65";
  const age = req.params.age,
    state = req.params.state,
    keyword = req.params.keyword;
  const data = await prisma.User.findMany({
    where: {
      accountType: "Mentor",
    },
  });

  data.map((user) => {
    if (user.state === state) {
      users.push(user);
    }
  });
  if (users.length === 0) {
    users = data;
  }
  if (age.charAt(2) === "-") {
    users.map((user) => {
      if (user.age >= age.substring(0, 2) && user.age <= age.substring(3, 5)) {
        matches.push(user);
      }
    });
  } else if (age === senior + "+") {
    users.map((user) => {
      if (user.age >= parseInt(senior)) {
        matches.push(user);
      }
    });
  }
  if (matches.length === 0) {
    matches = users;
  }
  matches.map((user) => {
    results = similarity(keyword, user.Headline);
    if (results > 0.1) {
      map1.set(results, user);
    }
  });
  map1 = new Map([...map1.entries()].sort());
  users = Array.from(map1.values());
  users = users.sort().reverse();
  res.json(users);
});
