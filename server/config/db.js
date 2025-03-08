import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "job-portal", // Set database name separately
            //useNewUrlParser: true,
            //useUnifiedTopology: true,
        });

        console.log("✅ Database Connected");
    } catch (error) {
        console.error("❌ Database Connection Failed:", error);
        process.exit(1);
    }
};

export default connectDB;
