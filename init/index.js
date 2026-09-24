const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");
const User = require("../models/user.js");


if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}


async function main() {
  const dbUrl = process.env.ATLAS_DB;
  await mongoose.connect(dbUrl);
}

const initDB = async ()=>{
    const seedOwner = await User.findOne();
    if (!seedOwner) {
      throw new Error("Create a user before running the seed script.");
    }

    await Listing.deleteMany({});
    const listings = initData.data.map((obj)=> ({
      ...obj,
      owner: seedOwner._id,
    }));

    await Listing.insertMany(listings);
    console.log("data was initialised");
};

main()
  .then(async () => {
    console.log("connected to Db");
    await initDB();
  })
  .catch((err) => {
    console.error("Unable to initialise data:", err.message);
    process.exit(1);
  });
