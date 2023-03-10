const express = require('express');
const app = express();
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const port = process.env.PORT || 5000;
app.set("view engine",'ejs');
const path = require("path");
const static1 = path.join(__dirname,"/views")
app.use(express.static(static1))
require("./connection/conn")
app.use(express.json());
app.use(express.urlencoded({ extended: false }))



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
        try{
        const pass = req.body.password;
        
            bcrypt.hash(pass, 12, async function (err, hash) {
               // console.log(hash);
              const  pass = hash;
                const detail = { email: req.body.email, password: pass, name: req.body.username, email_status: false }
            const usr = new schema(detail)
            const adnew = await usr.save();
            const otp = sendmail(req.body.email);
            otpsend = `${otp}`;
            res.send({ msg: "otp send to " + req.body.email })
           // res.send(pass)
            })
            
    
        }
        catch (e) {
            res.status(400).send(e);
        }
    })


    //otp verification

    app.post("/otpverification", async (req, res) => {

            try{
        if (otpsend === req.body.otp) {
            await schema.updateOne({ user_email: req.body.email }, { email_status: true });
            res.send({ msg: "password set return to the login page" })
        }
        else {
            res.send({ msg: "otp is not matching" })

        }
    }
       
            catch (e) {
                res.status(400).send(e);
            }
        
    

    })


    //login post

    app.post("/login", async (req, res) => {

        try {
            const lemail = req.body.email
            const password = req.body.password
            bcrypt.hash(password, 12, async function (err, hash) {
              //console.log(hash);
              hash;
              const semail = await schema.findOne({ email: lemail })
            const pass_verification =  bcrypt.compare(hash, semail.password)
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
            });
            
        }

        catch (e) {
            res.status(400).send(e);
        }
    })


    app.post("/forgetpassword", async (req, res) => {

        try{
        const semail = await schema.findOne({ email: req.body.email })
        if (!semail) {
            res.send({ msg: "email is not register" })
        }
        else {
            const otp = sendmail(req.body.email);
            otpsend = `${otp}`;
            res.send({ msg: "otp send to email " + req.body.email })
        }
        }
        catch (e) {
            res.status(400).send(e);
        }

    })


    //forget password otp verification

    app.post("/fov", async (req, res) => {
            try{
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
    }catch (e) {
        res.status(400).send(e);
    }

    })


    //google passport login

    app.get("/googlelogin", isLoggedIn, async (req, res) => {
      try{  useremail = req.user.email;
        const semail = await schema.findOne({ email: req.user.email })
        if (!semail) {
           
                const detail = { name: req.user.displayName, email: req.user.email, status: "verified" }

                const usr = new schema(detail);
                const adnew = await usr.save();
                // res.status(201).send(adnew);
                res.send({ msg: "user logged in" });
            
            
        }
        else {
            res.send({ msg: "user logged in" });
        }
    }
        catch (error) {
            res.status(400).send(error);
        }
    })

    




    app.listen(port, () => console.log("server is up....."))
