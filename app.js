const express=require("express");
const mongoose=require("mongoose");
const ejs=require("ejs");
const encrypt=require("mongoose-encryption")

const app=express();
app.use(express.urlencoded({extended:true}));

app.use(express.json());
app.set("view engine","ejs");

app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema= new mongoose.Schema({
    email:String,
    password:String
})

const secret="ThisisOurLongSeceret";
userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});

const User=mongoose.model("User",userSchema)



app.get("/",function(req,res){
   console.log("Went here");
    res.render("home")
});



app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});



app.post("/register",function(req,res){


    const newUser=new User({
      email:req.body.username,
        password:req.body.password
    });
   console.log(newUser.email); 
    newUser.save(function(err){
        if(err)
        {
            console.log(err);
           
        }
        else
        {
            res.render("secrets");
        }
    });
    
});


app.post("/login",function(req,res){

    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username},function(err,foundUser){
        if(!err)
        {
            if(foundUser){
            if(foundUser.password===password)
            res.render("secrets");
        
           }else
           {
            console.log("User not Found!!!");
           }
        }
        else
        {
            console.log(err);
        }
    });
});








app.listen(3000,function(){
     console.log("server started at port 3000...");
})