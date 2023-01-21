const mongoose = require("mongoose");
mongoose.set('strictQuery', true)

mongoose.connect(process.env.DBCONNECTION,

).then(()=> console.log("connected ...."))
.catch(()=>console.log("not connected"));