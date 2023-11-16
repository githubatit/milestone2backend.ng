import { config } from 'dotenv';
import express from "express";
import mongoose from 'mongoose';
import User from "./models/User.mjs";
import Blog from "./models/Blog.mjs";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';

config();
const app=express();

app.use(express.json());
app.use(cors({
    origin: true, 
    credentials: true,
  }));

const URI=process.env.URI
mongoose.connect(
    URI,
    {useNewUrlParser:true})
    .then(()=>{
        console.log("Connected to MongoDB");
    })
    .catch(()=>{
        console.log("Couldn't connect to MongoDB");
    })


app.post('/register',async (req,res)=>{
    const{username,email,password}=req.body;
    try {
        const user=await User.findOne({username:username})
        if(user) return res.status(400).json({msg:"The Email Already Exists"})
        const hashedpass= await bcrypt.hash(password,10);
        const userDoc=await User.create(
            {username:username,
             email:email,
             password:hashedpass
            });
        res.json(userDoc);        
    } catch (e) {
        res.status(400).json(e.message);
    }
})

app.get('/',(req,res)=>{
    res.send("Hello World");
})

app.post('/login', async (req,res)=>{
    try {
        const {username,password}=req.body
        const user=await User.findOne({username:username})
        if(!user) return res.status(400).json({msg:"User does not exists"})

        const isMatched= await bcrypt.compare(password,user.password)
        if(!isMatched) return res.status(400).json({msg:"Incorrect Password"})
        const payload={username,id:user._id}
        const token=jwt.sign(payload,process.env.secret,{expiresIn:"1d"})
        res.cookie('token',token).json("OK");
    } catch (err) {
        return res.status(500).json({msg:err.message})
    }
})

app.get('/Blogs', async (req,res)=>{
    try {
        const Blogs=await Blog.find();
        res.json(Blogs);
    } catch (err) {
        return res.status(500).json({err:"Error"});
    }  
})

app.post('/CreateBlog', async (req,res)=>{
    try {
       const {title,desc,username}=req.body;
       const newBlog=Blog({
        title:title,
        description:desc,
        username:username
       })
       await newBlog.save();
        res.json({"msg":"Scuccessfully Created"});
        } catch (err) {
        return res.status(500).json({msg:err.message})
    }
})

app.listen(process.env.PORT || 5000,()=>{
 console.log("SERVER IS LISTENING ON PORT 5000")   
});