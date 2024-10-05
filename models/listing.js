const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        //required:true
    },
    description:{
        type:String,
        //required:true
    },
    image:{
        url:String,
        filename:String

        // filename:{
        //     type:String
        // },
        // url:{
        //     type:String,
        //     default:
        //      "https://i0.wp.com/www.thelongroad.in/wp-content/uploads/2018/05/18-1024x683.jpg?resize=1024%2C683",
        //     set:(v) => v === "" ?"https://i0.wp.com/www.thelongroad.in/wp-content/uploads/2018/05/18-1024x683.jpg?resize=1024%2C683" : v,
        // }
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        //required:true
    },
    country:{
        type:String,
        //required:true
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    }

});
//this post middleware is always created before creating model for schema
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
