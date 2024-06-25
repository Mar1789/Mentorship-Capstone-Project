const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require('express');
const cors = require('cors') 
const bcrypt = require('bcrypt');
const app = express();

const saltRounds = 11;
let salt;
const PORT = 3000;
app.use(cors()); 
app.use(express.json());

console.log(process.env.NEW_VAR);
app.listen(PORT, () => {
    console.log(`Server is Running: ${PORT}`);
})

app.post("/account", async (req, res) => {    // Create new accounts
    const { username, password, accountType} = req.body
        bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            return;
        }  
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                // Handle error
                return;
            }
            console.log(hash);
            const user = await prisma.User.create({
                data : {
                    username,
                    password,
                    accountType
                }
            })
        })
    })
})
