const express = require("express");
const router = express.Router();
const schema = require("../model/model")
router.use(express.json());
router.use(express.urlencoded({extended:false}));
const cookiejk = require("cookie-parser");
const bodyParser= require("body-parser")
const jwt = require("jsonwebtoken");
const key = process.env.SESSION_SECRET;
const time = 1000*15*60;
router.use(cookiejk());
router.use(bodyParser.urlencoded({ extended: true }));
const sendmail = require("../nodemailer/mailer")




//signup post

router.post('/signup',async(req,res)=>{
const pass = req.body.password;
const repass= req.body.repassword;
//const adnew= schema.findOne(res.body.email)
if(pass===repass)
{
  const detail ={ user_email:req.body.email,password:pass,user_name:req.body.username,email_status:"notverified"}
 
  try{
    const usr= new schema(detail)
    const adnew = await usr.save();
    //req.otp=sendmail(req.body.email);
  
    //res.render("otpverification",{email:req.body.email})
   // console.log(req.otp)
    res.send({msg : "signup successful redirect to the login page"})
     }
  catch
  {
    res.status(400).send({msg:"email is all ready register"+"<html><br><br><a href='/'>return<a></html>"});
  }

 
}

else{
  res.send({msg:"entered password is not matching"+"<html><br><br><a href='/'>return<a></html>"})
  }
  
   
})


//otp verification

router.post("/otpverification",async(req,res)=>{

     console.log(req.otp)
    if(req.otp==req.body.otp)
    {
      await schema.updateOne({user_email:req.body.email},{email_status:"verified"});
      res.send({msg : "otp verified"})
    }
    else
    {
      res.send({msg:"otp is not matching"})

    }

})


//login post

router.post("/login", async (req, res) => {

try {
    const lemail = req.body.email
    const lpassword = req.body.password

    const semail = await schema.findOne({ user_email: lemail })
    if(semail&& semail.email_status===true)
    {
   // res.send(semail)
   // const pcheck = await bcrypt.compare(lpassword, semail.password)

    if (lpassword!=semail.password) {

        res.send( {msg:"password not match"} );
    }
    else {
            const token = jwt.sign({email:semail.email,id:semail._id},key)
             res.cookie("token", token, {
            expires: new Date(Date.now() + time),
              httpOnly: true})
              console.log(token);
              useremail=lemail;
              res.send({msg:`user logged in`,email:`${lemail}`})    
    }
  }
  else
  res.send({msg:"Email is not register"+"<html><br><br><a href='/'>signup<a></html>"})
}

catch (e) {
    res.status(400).send(e);
}
})


//forget password get



// forget password post

router.post("/forgetpassword",async(req,res)=>{
const semail = await schema.findOne({ user_email: req.body.email })
if(!semail)
{
res.send({msg:"Email is not register"+"<html><br><br><a href='/'>signup<a></html>"})
}
else
{
  sendmail(req.body.email);

res.render("fov",{email:req.body.email})
}

})


//forget password otp verification

router.post("/fov",async(req,res)=>{

     
if(otp===req.body.otp)
{
await schema.updateOne({user_email:req.body.email},{password:req.body.password});
res.redirect("/")
}
else
{
res.send({msg :"otp is not matching"+"<html><br><br><a href='/'>signup<a></html>"})
}
})

module.exports = router;
