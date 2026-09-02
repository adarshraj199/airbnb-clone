const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");


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


app.get("/" ,(req,res)=>{
    res.render("listings/home.ejs");
});



//index route

app.get("/listings" , wrapAsync(async(req,res)=>{
     const allListings = await Listing.find({});
     res.render("listings/index.ejs" ,{allListings});

}));


//new route 
app.get("/listings/new" ,(req,res)=>{
    res.render("listings/new.ejs")
})

//show route
app.get("/listings/:id" , wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs" ,{listing});
}));


//create route
app.post("/listings" , wrapAsync(async(req,res ,next)=>{
    let result = listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400 , result.error)
    }

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
   })
);


//edit route
app.get("/listings/:id/edit" ,wrapAsync( async(req,res)=>{
     let {id} = req.params;
    const listing = await Listing.findById(id);

    res.render("listings/edit.ejs" ,{listing});

}));

//update route
app.put("/listings/:id" , wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate( id ,{ ...req.body.listing});
    res.redirect(`/listings/${id}`);
}));


//delete route
app.delete("/listings/:id" , wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// app.get("/testlisting" ,async(req,res)=>{
//     let sampleListing = new Listing({
//         title: "My Home",
//         description:"near the waterfall",
//         price: 3000,
//         location: "navi mumbai , thane , mumbai",
//         country: "INDIA"
//     });

//     await sampleListing.save()
//     console.log("sample was saved");
//     res.send("sucessful testing");
// })

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