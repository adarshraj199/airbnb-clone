const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");


main()
.then(()=>{
    console.log("connected to Db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb-clone');

}

const initDB = async ()=>{
    await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=> ({
    ...obj ,
    owner: '6a9fae7f2e1fb4a55ff6fe48' ,
  }));

    await Listing.insertMany(initData.data);
    console.log("data was initialised");
};

initDB();