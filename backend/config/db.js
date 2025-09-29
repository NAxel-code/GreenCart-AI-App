import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log("MongoDB successfully connected");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

export default connectDB;