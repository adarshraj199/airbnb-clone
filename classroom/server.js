const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");


const sessionOptions ={secret: "mysupersecretstring" ,
    resave: false,
    saveUninitialized: true,
    };


app.set("view engine" ,"ejs");
app.set("views" , path.join(__dirname , "views"));

app.use(session (sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.sucessMsg = req.flash("sucess");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/register" , (req, res) => {
    let {name ="Unknown"} = req.query;
    req.session.name = name ;
    if( name ==="Unknown"){
        req.flash("error" , " User not reistered");
    }else{
    req.flash("sucess" , "user registered sucessfully");
    }
    res.redirect("/hello");
})

app.get("/hello" , (req,res)=> {
    res.render("page.ejs" ,{ name: req.session.name  , msg: req.flash("sucess")});
})




// app.get("/reqcount" , (req, res)=> {
//     if(req.session.count){
//         req.session.count++;
//     }else{
//     req.session.count = 1 ;
//     }
//     res.send(`you sent a request ${req.session.count} times `);
// });

// app.get("/test" , (req, res)=> {
//     res.send("test sucessful");
// });

app.listen(3000 , ()=> {
    console.log("server is started on localhost 3000");
});