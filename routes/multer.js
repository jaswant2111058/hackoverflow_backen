const express = require("express");
const imgModel = require("../model/model");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("../connection/conn");
const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.set("view engine", "ejs");

const  storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads");
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + "-" + Date.now());
	}
});

const upload = multer({storage : storage });

app.post("/", upload.single('image'),async (req, res, next)=>{
	var obj = {
		desc: req.body.desc,
		img: {
			data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename )),
			contentType : "image/png"
		}
	}
	imgModel.create(obj, (err, item) => {
		if(err){
			console.log(err)
		}
		else{
			res.redirect("/")
		}
	})
	
});

app.listen(5400,()=>{
	console.log("Server is up on port 5000");
})