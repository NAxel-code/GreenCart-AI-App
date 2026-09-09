import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: String,
    answer: String,
}, { timestamps: true });

const Question = mongoose.model("Question", questionSchema);

export default Question;