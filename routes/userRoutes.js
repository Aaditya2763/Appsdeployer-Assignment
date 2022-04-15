const express=require('express');
const router=express.Router();
const {isLoggedIn}=require('../middleware')

const User=require('../model/authenticatedUser');



router.get('/user',isLoggedIn,(req,res)=>{
    res.render('products/user')
    
});


router.get('/user/profile/:id',async(req,res)=>{
    const {id}=req.params;
    const user= await User.findById(id);
//console.log(user);
    res.render('products/userdata',{user});
})

router.patch('/user/profile/:id',async(req,res)=>{
    const {id}=req.params;
    const{email,firstName,lastName,phone_no}=req.body
    await User.findByIdAndUpdate(id,{email,firstName,lastName,phone_no});
    req.flash('success', 'Updated the profile successfully!');
        res.redirect('/user');
})









module.exports=router;