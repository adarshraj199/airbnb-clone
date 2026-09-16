const User = require("../models/user.js");

module.exports.getsignup = (req,res)=> {
res.render("users/signup.ejs");
};

module.exports.postSignup =  async(req,res)=> {
   try{
     let {username , email , password} = req.body ;
    const newUser = new User({username , email});
    const registeredUser = await User.register(newUser , password);

    req.login(registeredUser , (err)=>{
        if(err){
            return next(err);
        }

    req.flash("sucess" ,"welcome to airbnb-clone");
    res.redirect("/listings");
    })
  
   } catch(e){
    req.flash("error" , e.message);
    res.redirect("/signup");
   }
};


module.exports.getLogin = (req,res)=> {
    res.render("users/login.ejs");
};

module.exports.postLogin = async(req,res)=>{
    req.flash("sucess" , "welcome back to airbnb-clone");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

};



module.exports.logout = (req,res)=> {
    req.logout((err)=> {
        if(err){
            return next(err);
        }
    
    req.flash("sucess" , "you're logged out now ");
    res.redirect("/listings");
    })
};