const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require('dotenv').config()
const express = require('express');
const jwt = require('jsonwebtoken')
const cors = require('cors') 
const bcrypt = require('bcrypt');
const app = express();

const saltRounds = 11;
let salt;
const PORT = 4000;
app.use(cors()); 
app.use(express.json());

app.listen(PORT, () => {
    console.log(process.env.DATABASE_URL)
    console.log(`Server is Running: ${PORT}`);
})

app.post("/token", async(req, res) => {
    const refreshToken = req.body.token;
    if(refreshToken === null){
        res.json("FAILED");
    }
    const count = await prisma.token.count(
        {
          where: {
            token: refreshToken
          }
        })
    if(count === 0){
        res.sendStatus("INVALID TOKEN")
      } else{
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if(err){
                res.sendStatus("INVALID")
                console.log("Test");
            } else{
                const accessToken = GenerateAccessToken({name: user.name, id: user.id})
                res.json(accessToken);
            }
        })
      }
})

app.delete("/logout", authenticate, async(req, res) =>{
    const userId = res.locals.id;
    const deleteToken = await prisma.token.deleteMany({
        where: {
            userId: {   
                equals: parseInt(userId)
            }
        }
    })
    res.json(deleteToken);
})

app.post("/login", async(req, res) => { // Sign in
    const { username, password} = req.body;
    const user = await prisma.User.findUnique({
        where: {
          username: username,
        },
        include: {Token : true, Posts: true}
      })
    bcrypt.compare(password, user.password, async(err, result) => {
        if (err) {
            console.error('Error with password comparison', err);
            return;
        }
        if(result){
            const userprofile = { name: username, id: user.id}
            const accessToken = GenerateAccessToken(userprofile);
            const refreshToken = jwt.sign(userprofile, process.env.REFRESH_TOKEN_SECRET)

            const deleteToken = await prisma.token.deleteMany({
                where: {
                    userId: {
                        equals: parseInt(user.id)
                    }
                }
            })
            const token = await prisma.token.upsert({
                where: {
                    Token_id: parseInt(user.id),
                },
                update: {
                    token: refreshToken,
                  },
                create: {
                    userId: user.id,
                    token: refreshToken,
                  }
            })
            res.json({accessToken: accessToken, refreshToken: refreshToken })
        } else{
            res.json("PASSWORD FAILED!");
        }
    })
})

function GenerateAccessToken(userprofile){
    return jwt.sign(userprofile, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
}

function authenticate(req, res, next){
    const header = req.headers['authorization'];
    const token = header && header.split(" ")[1];
    if(token === null){
        res.json("Token in Bearer required")
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
        if(err){
            res.json("Invalid Token")
        }
        console.log(user.id);
        res.locals.id = user.id;
        next()
    })
}


