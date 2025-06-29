import User from "../model/user.model.js";
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

//register user

const registerUser = async (req, res) => {
    
    //get data
    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({
            message : "All fields are required"
        });
    }

    // If all fields are provided, send success response
    try {
        const existingUser = await User.findOne({email})
        if(existingUser) {
            return res.status(400).json({message : "User already exists"})
        }
        const user = await User.create({
            name,
            email,
            password
        })
        // console.log(user)

        if(!user) {
            return res.status(400).json({message : "User not registered"})
        }

        //if user created assign him a token
        const token = crypto.randomBytes(32).toString("hex")
        // console.log(token)

        //saving the verification token in database
        user.verificationToken = token
        await user.save()

        //send-email
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port:process.env.MAILTRAP_PORT ,
            secure: false, // upgrade later with STARTTLS
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
        });
        const mailOptions = {
            from : process.env.MAILTRAP_SENDEREMAIL,
            to : user.email,
            subject : "verify your email",
            text : `please click the link to verify
            ${process.env.BASE_URL}/api/v1/users/verify/${token}`
        }
        await transporter.sendMail(mailOptions)

        res.status(201).json({
            message : "user registered successfully",
            success : true
        })
        
    } catch (error) {
        res.status(400).json({
            message : "User not registered",
            error,
            success : false
        })
    }
};

//verify user

const verifyUser = async (req, res) => {
    try {
        //get token from the url
    const { token } = req.params
    // console.log(token)
    //validate
    if(!token) return res.status(400).json({message : "Invalid token! Try logging in again"})
    //find the user based on the token
    const user = await User.findOne({ verificationToken : token })
    //if not
    if(!user) return res.status(400).json({message : "Invalid token! Try logging in again"})
    //set isVerified field to true
    user.isVerified = true
    //remove verification token
    user.verificationToken = undefined
    //save
    await user.save()
    //return response
    res.status(200).json({
        message : "user verified successfully",
        success : true
    })
    } catch (error) {
        res.status(400).json({
            message : "verification failed",
            error,
            success : false
        })
    }
}

//login user
const login = async(req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        return res.status(400).json({message : "All fields are required"})
    } 

    try {
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({message : "User does not exist in the database"})
        }
       const isMatched =  await bcrypt.compare(password, user.password)
       console.log(isMatched)

       if(!isMatched) {
        return res.status(400).json({message : "Invalid password"})
       }
       
       //create session
       const sessiontoken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '24h'})

       const cookieOptions = {
        httpOnly: true,
        secure: true,
        maxAge : 24*60*60*1000 
       }

       res.cookie("sessiontoken", sessiontoken, cookieOptions)

       res.status(200).json({success : true, message : "Loggen in successfully", sessiontoken, user : {id : user._id, name : user.name, role: user.role}})
 
    } catch (error) {
        res.status(400).json({
            message : "login unsuccessfull, please try again"
        })
    }
    
    
}

export{registerUser, verifyUser, login}