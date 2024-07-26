const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const similarity = require("similarity");
const app = express();
const geolib = require("geolib");
const nodemailer = require("nodemailer");
const { defineDmmfProperty } = require("@prisma/client/runtime/library");

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
app.get("/filterPosts/:filter/:userId", async (req, res) => {
  const filter = req.params.filter;
  const userId = req.params.userId;
  let posts;
  if (filter === "Following") {
    const following = await prisma.follow.findMany({
      where: {
        followerId: parseInt(userId),
      },
    });
    posts = await prisma.posts.findMany({
      where: {
        OR: following.map((user) => ({
          userId: parseInt(user.userId),
        })),
      },
    });
  } else if (filter === "Most Recent") {
    posts = await prisma.posts.findMany({
      orderBy: {
        Post_id: "desc",
      },
    });
  } else if (filter === "Most Oldest") {
    posts = await prisma.posts.findMany({
      orderBy: {
        Post_id: "asc",
      },
    });
  }
  res.json(posts);
});

app.get("/posts", async (req, res) => {
  const posts = await prisma.posts.findMany({
    orderBy: {
      Post_id: "desc",
    },
  });
  res.json(posts);
});
app.delete("/post", async (req, res) => {
  const Post_id = parseInt(req.body.Post_id);
  const comments = await prisma.comments.deleteMany({
    where: {
      Post_id: Post_id,
    },
  });
  const likes = await prisma.like.deleteMany({
    where: {
      Post_id: Post_id,
    },
  });
  const post = await prisma.posts.deleteMany({
    where: {
      Post_id: Post_id,
    },
  });
  res.json(post);
});
app.post("/post", async (req, res) => {
  const { description, title, userId } = req.body;
  const post = await prisma.posts.create({
    data: {
      userId: userId,
      description: description,
      title: title,
    },
  });
  res.json(post);
});

app.get("/article/:articleId", async (req, res) => {
  const articleId = req.params.articleId;
  const article = await prisma.articles.findUnique({
    where: {
      articleId: articleId,
    },
  });
  res.json(article);
});
app.get("/articles", async (req, res) => {
  const articles = await prisma.articles.findMany({});
  res.json(articles);
});

app.get("/articles/:userId", async (req, res) => {
  const userId = req.params.userId;
  const articles = await prisma.articles.findMany({
    where: {
      NOT: {
        userId: parseInt(userId),
      },
    },
  });
  res.json(articles);
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
  const {
    userId,
    firstName,
    lastName,
    headline,
    role,
    age,
    state,
    bookingLink,
  } = req.body;
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
      bookingLink: bookingLink,
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
    orderBy: {
      comment_id: "desc",
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
    bookingLink,
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
            bookingLink,
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

app.get("/match/:userId/:age/:keyword", async (req, res) => {
  let matches = [];
  let priorityMatch = [];
  let map1 = new Map();
  const senior = "65";
  const age = req.params.age,
    keyword = req.params.keyword,
    userId = req.params.userId;
  let users = await prisma.User.findMany({
    where: {
      accountType: "Mentor",
    },
  });
  if (age.charAt(2) === "-") {
    //Filters mentors by the selected age range
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
    // If there are no mentors that fall in the age range, include all of them
    matches = users;
  }
  // Get student coordinates
  const studentCoords = await getCoords(userId);
  await Promise.all(
    matches.map(async (user) => {
      let distance;
      const coordinates = await getCoords(user.id);
      let likecount = await getLikes(user, userId);
      if (coordinates.length == 1 && studentCoords.length == 1) {
        // If the mentor and user coordinates are in the database, calculate the distance
        distance = geolib.getDistance(
          {
            latitude: studentCoords[0].latitude,
            longitude: studentCoords[0].longitude,
          },
          {
            latitude: coordinates[0].latitude,
            longitude: coordinates[0].longitude,
          }
        );
        // Convert the distance from meters to miles
        distance *= 0.000621371192;
      } else {
        distance = 10000;
      }
      priorityMatch.push({
        id: user.id,
        similarityScore: similarity(keyword, user.Headline),
        distance: distance,
        like: likecount,
      });
    })
  );
  const distanceMin = Math.min(...priorityMatch.map((item) => item.distance)); // Get the minimum and maximum distance out of all of the mentors
  const distanceMax = Math.max(...priorityMatch.map((item) => item.distance));
  const likeMin = Math.min(...priorityMatch.map((item) => item.like)); // Get the minimum and maximum likecount
  const likeMax = Math.max(...priorityMatch.map((item) => item.like));
  priorityMatch.map((user) => {
    let normLike;
    let normDistance;
    if (likeMin == likeMax) {
      // If the likecount of min/max are the same, then the normalized likecount is zero
      normLike = 0;
    } else {
      normLike = (user.like - likeMin) / (likeMax - likeMin); // Normalization formula (value-min)/(max-min)
    }
    // Normalization formula and taking the inverse since we want the shortest distance
    normDistance =
      1 - (user.distance - distanceMin) / (distanceMax - distanceMin);
    // Similarity score is 80% weighted, likecount is 10% weighted, and distance is 10% weighted
    const score =
      user.similarityScore * 0.8 + normLike * 0.1 + normDistance * 0.1;
    map1.set(score, user.id);
  });
  // Order the map by least to greatest average scores
  users = await reverseMap(map1);
  // Fetch the user with the highest average score (always index 0)
  const user = await prisma.user.findFirst({
    where: {
      id: users[0],
    },
  });
  res.json([user]);
});

async function reverseMap(map1) {
  map1 = new Map([...map1.entries()].sort());
  return Array.from(map1.values()).reverse();
}

async function getCoords(userId) {
  const coords = await prisma.coord.findMany({
    where: {
      userId: parseInt(userId),
    },
  });
  return coords;
}
async function getLikes(user, userId) {
  let likecount = 0;
  const posts = await prisma.posts.findMany({
    // Fetch all of the posts that the selected mentor has made
    where: {
      userId: user.id,
    },
  });
  for (const n in posts) {
    // For each post, add the amount of likes the user has done for each post (overall likecount)
    const likes = await prisma.like.findMany({
      where: {
        Post_id: posts[n].Post_id,
        userId: parseInt(userId),
      },
    });
    likecount += likes.length;
  }
  return likecount;
}

app.put("/changePassword", async (req, res) => {
  let { userId, password } = req.body;
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      return;
    }
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        return;
      }
      password = hash;
      const account = await prisma.user.update({
        where: {
          id: parseInt(userId),
        },
        data: {
          password: password,
        },
      });
      res.json(account);
    });
  });
});

app.delete("/verifyCode/:resetCode", async (req, res) => {
  const resetCode = req.params.resetCode;
  const currentDate = new Date();
  const validateCode = await prisma.verify.findMany({
    where: {
      resetCode: parseInt(resetCode),
    },
  });

  if (validateCode !== null && validateCode.length > 0) {
    if (validateCode[0].expiredAt < currentDate) {
      res.json("EXPIRED CODE");
    } else {
      const userId = validateCode[0].userId;
      const removeCode = await prisma.verify.deleteMany({
        where: {
          userId: validateCode[0].userId,
        },
      });
      res.json(userId);
    }
  } else {
    res.json("INVALID CODE");
  }
});

app.post("/resetPassword", async (req, res) => {
  const email = req.body.email;
  const validateUser = await prisma.user.findFirst({
    where: {
      username: email,
    },
  });
  if (validateUser === null) {
    res.json("Account not found with associated email");
  } else {
    const resetCode = Math.floor(100000 + Math.random() * 900000);
    const userId = validateUser.id;
    let expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() + 5);
    const verifyCode = await prisma.verify.create({
      data: {
        resetCode,
        userId,
        expiredAt,
      },
    });
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: '"Pioneer Path" <burneremailuf@gmail.com>', // sender address
      to: email,
      subject: "Reset password ✔",
      html: `<b>Your reset password code is ${resetCode}</b>`,
    });
    res.json(info.messageId);
  }
});
