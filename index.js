// initializing dotenv
require('dotenv').config();

// imports here
const express = require('express');
const cors = require("cors");
const path = require('path');

// creating express app
const app = express();

// setting express
app.set("views" , path.join(__dirname+"/views"));
app.set("view engine" , "ejs");

// connecting to database
require("./config/db")(process.env.DB_URL);

// initializing the port
const PORT = process.env.PORT || 8800;

const corsoptions = { credentials: true, origin: 'http://localhost:3000' };
// middlewares
app.use(express.json());
app.use(cors(corsoptions));
app.use(express.static('public'));

// routes
app.use("/files" , require("./routes/files"));

// default response
app.get("/", (req, res) => {
    
    const { name } = req.body;

    if (name) {
        return res.status(200).json({ msg: `Hey, ${name} my name is alexaa and i am an api of FilesGo app` })
    };

    return res.status(200).json({ msg: `Hey, Buddy my name is alexaa and i am an api of FilesGo app` })
});

// listning server
app.listen(PORT, (err) => {
    if (!err) {
        console.log(`http://127.0.0.1:${PORT}`);
    }
});