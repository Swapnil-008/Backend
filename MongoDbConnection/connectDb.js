import mongoose from "mongoose";

const connectDB = async () => {
    try{
        const connectInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
        console.log("MongoDB connected... DB Host: ", connectInstance.connection.host);
    }
    catch(err)
    {
        console.error(err.message);
        process.exit(1);   //this process gives the reference of the current working process.
    }
}

export default connectDB;