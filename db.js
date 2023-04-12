const mongoose = require('mongoose');
const url = process.env.MongoDB_URL;
require("dotenv").config();


const connect = () =>{

   return mongoose.connect(url,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex:true,
        // useFindAndModify:true,
        dbname: process.env.Database,
        user: process.env.db_user,
        pass: process.env.db_password,
        
    })
    .then(()=>{
        console.log("Connection Established with MongoDB")
        const connection = mongoose.connection;
   
        connection.on('connected', () => {
            console.log("Mongoose connection established with cluster only");
        })

        connection.on('disconnected', () => {
            console.log("Mongoose Disconnected!!!")
        })

        process.on("SIGINT", () => {  //this process isi used to closed the connection if we pressh the ctr+c button
            connection.close(() => {
                console.log("mongoose connection closed on the application Timeout")
                process.exit(0);
            })
        })

    })
    .catch((err) => {
        console.error(err.message,": database connection error");
    })
}


module.exports = connect;