import Question from "../models/Question.js";
import Session from "../models/Session.js";

// ADD ADDITIONAL QUESTIONS TO AN EXISTING SESSION
export const addQuestionToSession = async (req, res) => {
    try {
        const { sessionId, questions } = req.body;

        if(!sessionId || !questions || !Array.isArray(questions)) return res.status(400).json({ message: "Invalid Input Data" });

        const session = await Session.findById(sessionId);

        if(!session) return res.status(404).json({ message: "Session Not Found" }); 

        //CREATE NEW QUESTIONS
        const createQuestions = await Question.insertMany(
            questions.map((q) => ({
                session: sessionId,
                question: q.question,
                answer: q.answer,
            }))
        );

        //UPDATE SESSION TO INCLUDE NEW QUESTION IDs
        session.questions.push(...createQuestions.map((q) => q._id));
        await session.save();

        res.status(201).json(createQuestions);

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// PIN OR UNPIN A QUESTION
export const togglePinQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if(!question) return res.status(404).json({ success: false, message: "Question Not Found" });

        question.isPinned = !question.isPinned;
        await question.save();

        res.status(201).json({ success: true, question });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// UPDATE A NOTE FOR A QUESTION
export const updateQuestionNote = async (req, res) => {
    try {
        const { note } = req.body;
        const question = await Question.findById(req.params.id);

        if(!question) return res.status(404).json({ success: false, message: "Question Not Found" });

        question.note = note || "";
        await question.save();

        res.status(200).json({ success: true, question });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};