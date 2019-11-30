const express = require('express');
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const hasuserAccess=require("../middleware/userauth");
const hasadminAccess=require("../middleware/adminauth");

router.get("/login",(req,res)=> {
    res.render("User/login");
});

router.post("/login",(req,res)=> {
    const errorsLogin = [];

    if(req.body.username == "")
    {
        errorsLogin.push("Please enter your Username");
    }

    if(req.body.password == "")
    {
        errorsLogin.push("Please enter your Password");
    }

    if(errorsLogin.length > 0) {
        res.render("User/login",{login:errorsLogin})
    }

    else {
        const formData = {
            email : req.body.username,
            password : req.body.password
        }

        User.findOne({email:formData.email})
        .then(user=> {
            console.log(`${user}`);
            if(user == null) {
                errorsLogin.push("Sorry your email was not found");
                res.render("User/login",{login:errorsLogin})
            }
            else {
                bcrypt.compare(formData.password, user.password)
                .then(isMatched=> {
                    if(isMatched==true) {
                        if(user.type=="Admin") {
                        req.session.adminInfo=user;
                        res.redirect("/user/admindashboard");
                        }
                        else {
                            req.session.userInfo=user;
                            res.redirect("/user/userdashboard");
                        }
                    }
                    else {
                        errorsLogin.push("Passowrd does not match")
                        res.render("User/login",{login:errorsLogin})
                    }
                })
            }
        })
    }

});

router.get("/registration",(req,res)=>{
    res.render("User/registration")
});

router.post("/registration",(req,res)=>{
   
    const errorsRegis = [];
    
    if(req.body.email == "")
    {
        errorsRegis.push("Please enter an email");
    }
   
    if(req.body.lname == "")
    {
        errorsRegis.push("Please enter your last name");
    }

    if(req.body.fname == "")
    {
        errorsRegis.push("Please enter your first name");
    }

    if(req.body.password == "")
    {
        errorsRegis.push("Please enter a password");
    }

    else if (req.body.password != "") {
        const pattern = /^[0-9a-zA-Z]+$/;
        const passwordcheck = pattern.test(req.body.password);

        if(passwordcheck == false) {
            errorsRegis.push("Enter letters and numbers only");
        }
        if(req.body.password.length < 6|| req.body.password.length > 12) {
            errorsRegis.push("Please enter 6 to 12 characters");
        }    
    }

    if(req.body.confirmpassword == "") {
        errorsRegis.push("Please confirm a password");
    }
    
    if(req.body.password != req.body.confirmpassword) {
        errorsRegis.push("Paswword is different");
    }

    if(req.body.birthdate == "")
    {
        errorsRegis.push("Please enter your birthdate");
    }

    if(errorsRegis.length > 0) {
        res.render("User/registration",{registration:errorsRegis})
    }
    
    else {

    User.findOne({email:req.body.email})
    .then(email=> {
        if(email == null) {
            const formData = {
                fname : req.body.fname,
                lname : req.body.lname,
                email : req.body.email,
                password : req.body.password,
                birthdate : req.body.birthdate
            }
        
            const ta = new User(formData);
            ta.save()
            .then(()=> {
                console.log(`Users was inserted in to Database`);
                res.redirect("login");
            })
            .catch(err=> {
                console.log(`Task was not inserted into the database: ${err}`)
            })
        
            const nodemailer = require('nodemailer');
                 const sgTransport = require('nodemailer-sendgrid-transport');
        
                 const options = {
                    auth: {
                        api_key: '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'
                    }
                }
        
                const mailer = nodemailer.createTransport(sgTransport(options));
        
                const email = {
                    to: `${req.body.email}`,
                    from: 'taewooocean@gmail.com',
                    subject: 'Testing',
                    text: `Welcome to Airbnb`
                };
                 
                mailer.sendMail(email, (err, res)=> {
                    if (err) { 
                        console.log(err) 
                    }
                    console.log(res);
                });
        
            

        }
        else {
            errorsRegis.push("Email is alreday existed on database");
            res.render("User/registration", {registration:errorsRegis})
        }
    })
    }
});

router.get("/logout",hasuserAccess,(req,res)=> {
    req.session.destroy();
    res.redirect("/user/login");
})

router.get("/adminlogout",hasadminAccess,(req,res)=> {
    req.session.destroy();
    res.redirect("/user/login");
})

router.get("/userdashboard",hasuserAccess,(req,res)=> {
    res.render("User/userDashboard");
})

router.get("/admindashboard",hasadminAccess,(req,res)=> {
    res.render("User/adminDashboard");
})

module.exports=router;