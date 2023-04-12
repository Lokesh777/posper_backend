const authrouter = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');


const signupValidationRules = () => {
    return [
        check('firstName').notEmpty().withMessage('First name is required.'),
        check('lastName').notEmpty().withMessage('Last name is required.'),
        check('organisationName').notEmpty().withMessage('organisationName name is required.'),
        check('gstNumber').notEmpty().withMessage('GST number is required.'),
        check('address').notEmpty().withMessage('Address is required.'),
        check('mobileNumber').notEmpty().withMessage('Mobile number is required.'),
        check('mobileNumber').isMobilePhone().withMessage('Invalid mobile number format.'),
        check('email').notEmpty().withMessage('Email is required.'),
        check('email').isEmail().withMessage('Invalid email format.'),
        check('password').notEmpty().withMessage('Password is required.'),
        check('password').isLength({ min: 8 }).withMessage('Password should be at least 8 characters long.'),
      ];
  };


  authrouter.post('/signup',signupValidationRules(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    console.log(errors);
  
    const {
      firstName,
      middleName,
      lastName,
      organisationName,
      gstNumber,
      address,
      mobileNumber,
      email,
      password,
    } = req.body;
  
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(409).json({ message: 'User already exists.' });
      }

       // create new user and save to database
        const salt = await bcrypt.genSaltSync(12);
        const hashedPassword = await bcrypt.hashSync(password, salt);
      const newUser = new User({
        firstName,
        middleName,
        lastName,
        organisationName,
        gstNumber,
        address,
        mobileNumber,
        email,
        password: hashedPassword,
      });

      await newUser.save();
      res.status(200).json({ message: 'User created successfully.',newUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });

//login data
authrouter.post("/login",async (req, res) => {
    const { email, password,username }=req.body;
    try{
  
        const user = await User.findOne({email});
        if (!user) {
            return res.status(209).json({
                message:"this username does not exist!"
            })
        }
  
        bcrypt.compare(password, user.password,(err,result)=>{
               if(err){
                return res.status(401).json({
                    message:"Authentication failed"
                })
               }
               if(result){
                    const token = jwt.sign(
                        {email:user.email, userId:user._id,role:user.role},
                        process.env.secret,
                        {expiresIn:"7 day"}
                    )
                    
                    return res.status(200).json({
                        message:`Login successful for ${user.username}`,
                        token:token,
                        username:user.username,
                        userId:user._id,
                        profile:user.profile,
                        email:user.email,
                    })
               }
  
               return res.status(401).json({
                 message:`wrong password!`
               });
  
        })
  
    }catch(err){
            console.log(err)
          return res.status(500).json({
            err:"Error checking user credentials"
          })
    }
          
  } )

module.exports = authrouter;