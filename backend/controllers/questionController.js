import Question from "../models/Question.js";

// ADD ADDITIONAL QUESTIONS TO AN EXISTING SESSION
export const addQuestionToSession = async (req, res) => {
    try {
        const { questions } = req.body;

        if(!questions || !Array.isArray(questions)) return res.status(400).json({ message: "Invalid Input Data" });

        //CREATE NEW QUESTIONS
        const createQuestions = await Question.insertMany(
            questions.map((q) => ({
                recipe: q.question,
                answer: q.answer,
            }))
        );

        res.status(201).json(createQuestions);

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};