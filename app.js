const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT||5000;
require('./auth');
require("./connection/conn")
app.set("view engine",'ejs');
const path = require("path");
const static1 = path.join(__dirname,"/views")
app.use(express.static(static1));
app.set("view engine", "ejs");
const login =  require("./routes/login")
const google =  require("./routes/google")
const main =  require("./routes/main")


app.use("/",login);
app.use("/",google);
app.use("/",main);


app.listen(port,()=>console.log("server is up....."));
