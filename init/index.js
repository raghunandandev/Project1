const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongodb = "mongodb://127.0.0.1:27017/Wander";

main().then((res)=>{
    console.log("Database connected successfully");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(mongodb);
}

const init = async ()=>{
    await Listing.deleteMany({});
    // let insertedData = await Listing.insertMany(initData.data);
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner : '66f918522b672cf87e905baa',
    }));
    
    let insertedData = await Listing.insertMany(initData.data);

    console.log("DataInserted To Database");
    console.log(insertedData);
    console.log("DataInserted To Database");

}

init();