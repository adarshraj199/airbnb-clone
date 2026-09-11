const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { any } = require("joi");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

main()
.then(()=>{
    console.log("connected to Db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb-clone');

}

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname ,"public")))



const sessionOptions = {
    secret: "mysupersecret" ,
    saveUninitialized: true ,
    resave: false ,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000 ,
       
        httpOnly: true,
    },
};




app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.sucessMsg = req.flash("sucess");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


// app.get("/demouser" , async(req,res)=>{
//     let fakeUser = new User({
//         email: "kumar@gmail.com",
//         username: "old-student",
//     });

//     let newUser = await User.register(fakeUser , "herethere");
//     res.send(newUser);
// })


app.get("/" ,(req,res)=>{
    res.render("listings/home.ejs");
});


app.use("/listings" , listings);
app.use("/listings/:id/reviews" , reviews );
app.use("/" , userRouter );


app.all("/*splat" ,(req,res,next)=> {
    next( new ExpressError(404 , "page not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500 , message="Something went wrong" } = err;
    res.status(statusCode).render("includes/Error.ejs" ,{message});
});
app.listen("8080" , ()=>{
    console.log("server is working");
});