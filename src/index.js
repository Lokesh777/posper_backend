const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); 
const connect = require('../db'); 
const PORT = process.env.PORT || 5000;
const userRouter = require('./Routes/user.route');
const authrouter = require('./Routes/auth.route');

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api/auth",authrouter)
app.use("/api/user",userRouter)

app.use("/",(req,res)=>{
   res.status(201).json({message: 'Welcome to The CipherSchool'});
    res.send();
})



app.listen(PORT,async ()=>{
    await connect()
    console.log(`Server listening on port : http://localhost:${PORT}`);
  });