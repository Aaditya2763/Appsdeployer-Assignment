const express = require("express");
const router = express.Router();
const User = require("../model/authenticatedUser");
const passport = require("passport");
const Product = require("../model/userDetails");
const mailer = require("nodemailer");

const randomOtp = Math.floor(Math.random() * (10000- 1)) + 1;
const validOtp=randomOtp;

//function to check mail otp
function mailvarifier(submittedOTP) {
    if (submittedOTP ===validOtp) {
      console.log('OTP varified Successfully')
    } else {
       
        console.log('invalid OTP')
        
        // res.redirect("/auth/ptpvarification");
    
    }
}
///////////////////////////////////////////////////////////////

router.get("/auth/otpVarification", (req, res) => {
  res.render("auth/otpForm");
});

/////////////////////////////////////////////////////////////

router.post("/auth/otpVarification",(req, res) => {
    try{
        const {otp}=req.body;
        mailvarifier(otp);
      req.flash("success", 'mail varified successfully');
      res.redirect('/auth/login');
    } 
    catch (e) {
      req.flash("error", e.message);
      res.redirect("/auth/register");
    }

  
  
    });
//////////////////////////////////////////////////////////////

router.get("/auth/register", (req, res) => {
  res.render("auth/register");
});
///////////////////////////////////////////////

router.post("/auth/register", async (req, res) => {
  try {
    const { email, username, password, lastName, firstName, phone_no } =
      req.body;
    await Product.create({ email, username, password, lastName, firstName });
    const user = new User({ email, username, lastName, firstName, phone_no });
    //registering user
    await User.register(user, password);

    ////sending otp to mail

    var transporter = mailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      requireTLS: true,
      service: "gmail",
      auth: {
        user: "singhaditya2763@gmail.com",
        pass: "dcdxehczurygspsp",
      },
    });

    var mailOptions1 = {
      from: "singhaditya2763@gmail.com",
      to: "singhaditya2763@gmail.com",
      subject: "This is a system generated mail do not reply.",
      text: ` Your OTP for email varification is ${validOtp}
    Please do not share with anyone.
     
            `,
    };
    
    var mailOptions2 = {
        from: "singhaditya2763@gmail.com",
        to: "singhaditya2763@gmail.com",
        subject: "This is a system generated mail do not reply.",
        text: ` This is the system generated data of Mr/Mrs. ${firstName} ${lastName}
        
        Username :${username},
        Phone_no:${phone_no},
        Email :${email},
       
              `,
      };

    transporter.sendMail(mailOptions1, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("mail sent successfully" + info.response);
      }
      
    });

    transporter.sendMail(mailOptions2, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("mail sent successfully" + info.response);
        }
        
      });
    req.flash("success", 'mail sent successfully');
    res.redirect('/auth/otpVarification');
  } 
  catch (e) {
    req.flash("error", e.message);
    res.redirect("/auth/register");
  }
});

//////////////////////////////////////////////////////

router.get("/auth/login", (req, res) => {
  res.render("auth/login");
});

//////////////////////////////////////////////////////////

router.post(
  "/auth/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: true,
  }),
  (req, res) => {
    try {
      req.flash("success", "welcome back!");
      res.redirect("/user");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/auth/login");
    }
  }
);
//////////////////////////////////////////////////////////////

router.get("/auth/logout", (req, res) => {
  req.logout();

  req.flash("success", "Good Bye!!");
  req.flash("error", "You need to log in again");
  res.redirect("/");
});

//////////////////////////////////////////////////////

module.exports = router;
