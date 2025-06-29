import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const db = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to mongoDB")
    })
    .catch((err) => {
        console.log("Error connecting to mongoDB", err)
    })
}

export default db;