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
const PORT = 3000;
app.use(cors()); 
app.use(express.json());

app.listen(PORT, () => {
    console.log(process.env.DATABASE_URL)
    console.log(`Server is Running: ${PORT}`);
})

app.get("/posts", authenticate, async (req, res) => { // Gets posts made by user
    const userId = res.locals.id;
    const posts = await prisma.posts.findMany({
        where: {
            userId: {
                equals: userId
            }
        }
});
    res.json(posts);
})



app.post("/register", async (req, res) => {    // Create new accounts

    let { username, password, accountType} = req.body;
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
                data : {
                    username,
                    password,
                    accountType
                }
            })
            res.json(user);

        })
    })
})

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
