import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.warn("Warning: MONGO_URI is not defined in .env");
      return;
    }

    await mongoose.connect(uri);

    console.log("MongoDB successfully connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

export default connectDB;