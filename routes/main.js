const express = require("express");
const router = express.Router();
const schema = require("../model/model")
const bodyParser= require("body-parser") 
const isLoggedIn = require("../middleware/middleware")




router.post("/resume/save",isLoggedIn, async (req,res)=>
    {           
        try{
                const user_detail = req.body.user
                let user = await schema.findOne({email:req.body.email})
                user= user.user_detail;
                user.push(user_detail);
                await schema.updateOne({email:req.body.email},{user_detail:user}) 
                const temp = req.body.temp;
       // let user = await schema.findOne({email:req.body.email})
        //console.log(user)
       //  user= user.user_detail.pop();
         
         res.send("yes")
        // if(temp=="1")
        // {       
        //    // res.send("msg")
        //     res.render("temp1",{user:user_detail})
        // }
        // else if(temp=="2")
        // {
        //     res.render("temp2",{user:user_detail})
        // }
        // else if(temp=="3")
        // {
        //     res.render("temp3",{user:user_detail})
        // }
        // else
        // {
        //     res.render("temp4")
        // }  

        }
        catch (error) {
            res.status(400).send(error);
        }
    })



    router.post("/resume/request",isLoggedIn, async (req,res)=>
    {
        try{
               //const user_detail = req.body.detail
                let user = await schema.findOne({email:req.body.email})
                user= user.user_detail;
               // user.push(user_detail);
                await schema.updateOne({email:req.body.email},{user_detail:user}) 

           res.send({msg:detail})
        }
        catch (error) {
            res.status(400).send(error);
        }
    })

    router.get("/resume/request/download", isLoggedIn, async (req,res)=>{
       
        try{
        const temp = req.body.temp;
        let user = await schema.findOne({email:req.body.email})
        console.log(user)
         user= user.user_detail.pop();
        if(temp=="1")
        {       console.log(user)
            res.render("temp1",{user:user})
        }
        else if(temp=="2")
        {
            res.render("temp2",{user:user})
        }
        else if(temp=="3")
        {
            res.render("temp3",{user:user})
        }
        else
        {
            res.render("temp4")
        }
    }
    catch
    {
        res.send("error").status(400)
    }
    })

    module.exports=router;
