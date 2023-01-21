const express = require('express');
const app = express();
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const port = process.env.PORT || 5000;
require('../auth');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const schema = require("../model/model")
const cookiejk = require("cookie-parser");
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken");
const key = process.env.SESSION_SECRET;
const time = 1000 * 15 * 60;
app.use(cookiejk());
app.use(bodyParser.urlencoded({ extended: true }));
var nodemailer = require('nodemailer');
const { findOne } = require('../model/model');
let otpsend = process.env.OTP;
let useremail = process.env.EMAIL;

//--------------------------mail sending function----------------------------------------
function sendmail(email) {
    const random = Math.floor(Math.random() * 99999) + 10000;

    console.log(random);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "jkstar0123@gmail.com",
            pass: process.env.EMAIL_PASS,
        }
    })
    var mailOptions = {
        from: 'jkstar0123@gmail.com',
        to: `${email}`,
        subject: 'registor email verification',
        text: `OTP IS ${random}`
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
    return random;
}

//------------------------------google passport-----------------------------------------//
app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }
    ));
app.use(session({ secret: "jassi", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
//--------------------------------------middleware------------------------------------------------//
function isLoggedIn(req, res, next) {

    if (req.user || useremail) {
        next();

    }
    else {
        res.send({
            msg: "not autharaised"
        })
    }
}

    //------------------------------google call back-----------------------------------------------//

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/googlelogin',
            failureRedirect: '/auth/google/failure'
        })
    );


    //------------------------------api-----------------------------------------------//


    //login get

    app.get("/", (req, res) => {

        res.render("login")
    })


    //signup get

    app.get("/signup", (req, res) => {

        res.render("signup")
    })


    //signup post

    app.post('/signup', async (req, res) => {
        let pass = req.body.password;
        try {
            bcrypt.hash(pass, 12, async function (err, hash) {
                pass = hash;
            })



            const detail = { email: req.body.email, password: pass, name: req.body.username, email_status: false }


            const usr = new schema(detail)
            const adnew = await usr.save();
            const otp = sendmail(req.body.email);
            otpsend = `${otp}`;
            res.send({ msg: "otp send to " + req.body.email })
        }
        catch
        {
            res.status(400).send({ msg: "email is all ready register" });
        }
    })


    //otp verification

    app.post("/otpverification", async (req, res) => {


        if (otpsend === req.body.otp) {
            await schema.updateOne({ user_email: req.body.email }, { email_status: true });
            res.send({ msg: "password changed return to the login page" })
        }
        else {
            res.send({ msg: "otp is not matching" })

        }

    })


    //login post

    app.post("/login", async (req, res) => {

        try {
            const lemail = req.body.email
            const password = req.body.password

            const semail = await schema.findOne({ user_email: lemail })
            const pass_verification = await bcrypt.compare(password, semail.password)
            if (!pass_verification) {
                res.send({
                    msg: "password is not matching or email"
                })
            }
            else {
                const token = jwt.sign({ email: semail.email }, key)
                res.cookie("token", token, {
                    expires: new Date(Date.now() + time),
                    httpOnly: true
                })
                console.log(token);
                useremail = lemail;
                res.send({
                    msg: "user successfuly logged in"
                })
            }
        }

        catch (e) {
            res.status(400).send(e);
        }
    })


    app.post("/forgetpassword", async (req, res) => {
        const semail = await schema.findOne({ email: req.body.email })
        if (!semail) {
            res.send({ msg: "email is not register" })
        }
        else {
            const otp = sendmail(req.body.email);
            otpsend = `${otp}`;
            res.send({ msg: "otp send to email " + req.body.email })
        }

    })


    //forget password otp verification

    app.post("/fov", async (req, res) => {

        let pass = req.body.password;

        bcrypt.hash(pass, 12, async function (err, hash) {
            pass = hash;
        })

        if (otpsend === req.body.otp) {
            await schema.updateOne({ user_email: req.body.email }, { password: pass });
            res.send({ msg: "password changes" })
        }
        else {
            res.send({ msg: "otp is not matching" })

        }

    })


    //google passport login

    app.get("/googlelogin", isLoggedIn, async (req, res) => {
        useremail = req.user.email;
        const semail = await schema.findOne({ email: req.user.email })
        if (!semail) {
            try {
                const detail = { name: req.user.displayName, email: req.user.email, status: "verified" }

                const usr = new schema(detail);
                const adnew = await usr.save();
                // res.status(201).send(adnew);
                res.send({ msg: "user logged in" });
            }
            catch (error) {
                res.status(400).send(error);
            }
        }
        else {
            res.send({ msg: "user logged in" });
        }
    })

    app.post("/resume/save",isLoggedIn, async (req,res)=>
    {
            try{
                const user_detail = req.body.detail
                let detail = await schema.findOne({email:useremail})
                detail= detail.detail;
                detail=detail.push(user_detail);
                await schema.updateOne({email:detail.email},{detail:detail})


            }
            catch{

            }
    })





    app.listen(port, () => console.log("server is up....."))
