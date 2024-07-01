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
app.get("/commentUser/:id", async (req, res) => {
  // Gets users for each comment
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
