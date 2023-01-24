const nodemailer = require("nodemailer")

function sendmail( email)
{
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
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
})

return random;
}
module.exports=sendmail;