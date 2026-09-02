const mongoose = require("mongoose");
const Schema = mongoose.Schema ;

const defaultimage = "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const listingSchema = new Schema({
    title:{
        type:String,
        required: true,
    },
    description:{
        type: String,
    },
    
      image: {
        filename: {
            type: String,
            default: "listingimage",
        },
        url: {
            type: String,
            default: defaultimage,
            set: (v) => (v === "" ? defaultimage : v),
        },
    },
    price:{
        type: Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },

});


const Listing =mongoose.model("Listing" , listingSchema);
module.exports = Listing ;