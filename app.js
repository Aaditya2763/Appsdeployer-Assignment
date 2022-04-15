const express=require('express');
const app=express();
const path=require('path');
const ejsMate=require('ejs-mate');
const session=require('express-session')
const flash = require('connect-flash');
const passport=require('passport');
const mongoose=require('mongoose');
const methodoverride=require('method-override');
const LocalStrategy=require('passport-local');
const User=require('./model/authenticatedUser');
const mailer=require('nodemailer')

app.engine('ejs',ejsMate);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')

app.use(express.urlencoded({ extended: true }));
app.use(methodoverride('_method'));

app.use(express.static(path.join(__dirname,'public')));

mongoose.connect('mongodb://localhost:27017/appdeployer-assignment')
    .then(() => console.log("DB CONNECTED"))
    .catch((err) => console.log(err));



const sessionConfig = {
    
    secret:"weneedabettersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      // secure: true,
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7 * 1,
      maxAge:1000 * 60 * 60 * 24 * 7 * 1
    }
  }

  


  app.use(session(sessionConfig));
  app.use(flash());
  
  
  // Initialising passport in app
  app.use(passport.initialize());
  app.use(passport.session());
  
  // setting up local strategy 
  passport.use(new LocalStrategy(User.authenticate()));
  
  // add the user into the session
  passport.serializeUser(User.serializeUser());
  // removes the use from the session
  passport.deserializeUser(User.deserializeUser());
  
  
  app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
   
    next();
  });

 
  const userRoutes=require('./routes/userRoutes')
  const authRoutes=require('./routes/authRoutes')

app.use(userRoutes);
app.use(authRoutes);


const seedDB=require('./seed')
seedDB();

app.get('/',(req,res)=>{
    res.render('home')
})



app.listen(3000,(req,res)=>{
    console.log('server started at port 3000')
})
