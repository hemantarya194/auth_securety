//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption");


const app = express();

console.log(process.env.API_KEY)

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User =  mongoose.model("User", userSchema);


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    try {
       const user = await newUser.save();
       if (user) {
        console.log("Data successfully saved");
        res.render("secrets");
       }
       
   } catch (err) {
        console.log(err);
   }
});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const foundUser = await User.findOne({email: username});
        
        if(foundUser){
            if(foundUser.password === password){
                //console.log(foundUser.password);
                res.render("secrets");
            }
        }
    } catch (error) {
        console.log(error);
    }
});



app.listen(3000, function() {
    console.log("Server started on port 3000");
});