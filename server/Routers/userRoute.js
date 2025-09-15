const router = require('express').Router();
const User = require('../models/userSchema')
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');

router.post('/register',async (req,res)=>{
    const {name,email,password} = req.body
    try{
        if (!email,!password,!name){
            return res.status(400).json({message:'*name, email and password are required', success:false});
        }
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:'Email already exists'})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await new User({name,email,password:hashedPassword});
        await newUser.save();
        res.status(201).send({message:"User Created Successfully.", success:true})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message:"server error",success:false})
    }
});

router.post('/login',async (req,res)=>{
    const {email, password} = req.body
    try{
        if(!email || !password){
             return res.status(400).json({message:'*email and password are required', success:false});
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:'User not found'});
        }
        const isPasswordMatch = await bcrypt.compare(password,user.password)
         if (!isPasswordMatch){
             return res.status(401).json({ message: 'Invalid credentials.' });
         }
         const payload = {id:user._id,email:user.email}
         const token = jwt.sign(payload,process.env.JWT_CODE)
         res.status(200).json({message:'Login successful.',token,success:true})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message:"server error",success:false})
    }
});


module.exports=router;