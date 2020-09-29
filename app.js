//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true,useUnifiedTopology:true});
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
const secrets="thisisoursecret";
userSchema.plugin(encrypt, { secret: secrets, encryptedFields:["password"] });



const User=mongoose.model("User",userSchema);


app.get("/", function(req,res){
    res.render("home");
})
app.get("/login", function(req,res){
    res.render("login");
})
app.get("/register", function(req,res){

    res.render("register",{err:null});
})
app.post("/register", function(req,res){


const newUser=new User({
email:req.body.username,
password:req.body.password
})

newUser.save(function(err){
    if(!err){
res.render("secrets");
    }
    else{
        console.log(err);
    }
});


});

app.post("/login", function(req,res){
  
const eamil=req.body.username;
const password=req.body.password;
User.findOne({email:req.body.username}, function(err, foundUsers){
    if(!err){
      if(foundUsers.password===req.body.password){
        res.render("secrets");
      }
      else{
        res.render("register", {err:"OOPs you don't have an account"});
      }
       
      
    }
    else{
       console.log(err)
    }
})
   
  


});
    












app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  