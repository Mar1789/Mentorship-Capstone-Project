const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
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
  // Delete likes from a post
  const postId = parseInt(req.params.id);
  const UserId = parseInt(req.body.userId);
  const count = await prisma.like.count({
    where: {
      Post_id: {
        equals: postId,
      },
      userId: UserId,
    },
  });
  if (count === 1) {
    const like = await prisma.like.deleteMany({
      where: {
        Post_id: {
          equals: postId,
        },
        userId: UserId,
      },
    });
    res.json(like);
  } else {
    res.json("User already deleted. Sorry!");
  }
});
app.post("/likes/:id", async (req, res) => {
  // Add like to a post
  const postId = parseInt(req.params.id);
  const UserId = parseInt(req.body.userId);
  const count = await prisma.like.count({
    where: {
      Post_id: {
        equals: postId,
      },
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
app.get("/likeUser/:id/:user", async (req, res) => {
  // Checks if user liked or not when page loads
  const postId = parseInt(req.params.id);
  const UserId = parseInt(req.params.user);
  const count = await prisma.like.count({
    where: {
      Post_id: {
        equals: postId,
      },
      userId: UserId,
    },
  });
  res.json(count);
});
app.get("/likes/:id", async (req, res) => {
  // Gets likes for a specific post
  const postId = req.params.id;
  const likes = await prisma.like.count({
    where: {
      Post_id: {
        equals: parseInt(postId),
      },
    },
  });
  res.json(likes);
});

app.get("/commentcount/:id", async (req, res) => {
  // Get comment count to display for each post
  const postId = req.params.id;
  const commentCount = await prisma.comments.count({
    where: {
      Post_id: {
        equals: parseInt(postId),
      },
    },
  });
  res.json(commentCount);
});

app.get("/posts", async (req, res) => {
  // Gets posts made by user
  const userId = res.locals.id;
  const posts = await prisma.posts.findMany({
    where: {
      userId: {
        equals: userId,
      },
    },
  });
  res.json(posts);
});
app.post("/post", async (req, res) => {
  // Make posts made by user
  const { description, title, id } = req.body;
  const post = await prisma.posts.create({
    data: {
      userId: id,
      description: description,
      title: title,
    },
  });
  res.json(post);
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
  // Get Comments from post
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
  // Gets users for each Post
  const userId = req.params.id;
  const user = await prisma.User.findFirst({
    where: {
      id: parseInt(userId),
    },
  });
  res.json(user);
});

app.post("/register", async (req, res) => {
  let { username, password, Headline, FirstName, LastName, accountType } =
    req.body;
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
          // Handle error
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
          },
        });
        res.json(user);
      });
    });
  }
});
