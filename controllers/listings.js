const Listing = require("../models/listings.js");
const { listingSchema } = require("../schema.js");

module.exports.index = async(req,res)=>{
     const allListings = await Listing.find({});
     res.render("listings/index.ejs" ,{allListings});

};



module.exports.newroute =  (req,res)=>{
   
    res.render("listings/new.ejs")
};

module.exports.showroute =async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews" , populate:{path: "author" ,},}).populate("owner");
    if(!listing){
            req.flash("error" ,"The listing you trying to reach do not exist");
            return res.redirect("/listings");
    }
    res.render("listings/show.ejs" ,{listing});
};


module.exports.createroute = async(req,res ,next)=>{
    let result = listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400 , result.error)
    }
    
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename};
    await newListing.save();
    req.flash("sucess" ," new listing created");
    res.redirect("/listings");
   };


   module.exports.editroute = async(req,res)=>{
        let {id} = req.params;
       const listing = await Listing.findById(id);
       let originalUrl = listing.image.url;
      originalUrl =  originalUrl.replace("/upload" , "/upload/w_250");
       
   
       res.render("listings/edit.ejs" ,{ listing, originalUrl});
   
   };


   module.exports.updateroute = async(req,res)=>{
       let {id} = req.params;
      let newListing = await Listing.findByIdAndUpdate( id ,{ ...req.body.listing} ,{new : true});

      if(typeof req.file !== "undefined"){
        let url = req.file.path;
      let filename = req.file.filename;
      newListing.image = {url , filename};
      await newListing.save();
      }

         req.flash("sucess" ," listing updated sucessfully");
       res.redirect(`/listings/${id}`);
   };



   module.exports.deleteroute = async(req,res)=>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
      req.flash("sucess" ," listing deleted sucessfully");
    res.redirect("/listings");
};


module.exports.searchListings = async(req, res)=> {
    let {q} = req.query;
    if(!q || q.trim() === ""){
        req.flash("error" , "Palace not available");
        return res.redirect("/listings");
    }

    const allListings = await Listing.find({
         title: { $regex: q, $options: "i" }

    });

    if(allListings.length === 0){
        req.flash("error" , "No such Palace found");
        return res.redirect("/listings");
    }

    res.render("listings/index.ejs" , {allListings , q});
}