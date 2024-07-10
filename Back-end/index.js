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
  // Delete likes from a post
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

app.get("/users", async (req, res) => {
  const user = await prisma.User.findMany();
  res.json(user);
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
            age: parseInt(age),
            state,
          },
        });
        res.json(user);
      });
    });
  }
});

app.get("/match", async (req, res) => {
  let users = []; // Hold users when filtering by states
  let matches = []; // Hold users when filtering by age
  let results; // Similarity score
  let map1 = new Map(); // Storing users with the similarity score as the key and the value using the user information
  const { age, state, keyword } = req.body;
  const data = await prisma.User.findMany({ // Gets users from the database
    where: {
      accountType: "Mentor", 
    },
  });
  users.map((user) => {
    if (user.state === state) {
      users.push(user);
    }
  });
  if (users.length === 0) {
    // res.status(404).send(`No mentors exist in the state of ${state} yet! Will display mentors from all states`)
    users = data;
  }
  if (age.charAt(2) === "-") {
    users.map((user) => {
      if (user.age >= age.substring(0, 2) && user.age <= age.substring(3, 5)) {
        matches.push(user);
      }
    });
  } else if (age === "38+") {
    users.map((user) => {
      if (user.age >= 38) {
        matches.push(user);
      }
    });
  }
  if (matches.length === 0) {
    // If no account has the desired age or if the user chose 18+
    // res.status(404).send(`No mentors exist in the age range of ${age} yet! Will display mentors from all ages`)
    matches = users;
  }
  matches.map((user) => {
    results = similarity(keyword, user.Headline);
    if (results > 0.4) {
      // If the similarity is >40%, add it to the map
      map1.set(results, user);
    }
  });
  map1 = new Map([...map1.entries()].sort()); // Sorts the map
  users = Array.from(map1.values()); // Adds the users from least to most similar into an array
  users = users.sort().reverse(); // Reverse the array so it is shown from most similar to least
  res.json(users);
});
