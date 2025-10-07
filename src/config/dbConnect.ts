import mongoose from 'mongoose'
// require("dotenv").config()

async function DBConnect(){
    try{
        let MONGDB_URL=process.env.MONGDB_URL
        // console.log(MONGDB_URL)
        if(!MONGDB_URL){
            throw new Error("MONGDB_URL is not defined in environment variables")
        }
        await mongoose.connect(MONGDB_URL)
        console.log("Mongo connected...")
    }catch(error){
        console.log(error)
    }
}

export default DBConnect