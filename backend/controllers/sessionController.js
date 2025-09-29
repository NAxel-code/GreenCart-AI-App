const Session = require("../models/Session");
const Question = require("../models/Question");

// CREATE NEW SESSION AND LINKED QUESTIONS
exports.createSession = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, description, questions } = req.body;

        const userId = req.user._id;
        // console.log(userId);

        const session = await Session.create({
            user: userId,
            role,
            experience,
            topicsToFocus,
            description,
        });

        const questionDocs = await Promise.all(
            questions.map(async (q) => {
                const question = await Question.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer,
                });

                return question._id;
            })
        );

        session.questions = questionDocs;
        await session.save();

        res.status(201).json({ success: true, session });

        
    } catch (error) {
        // console.error("Create Session Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET ALL SESSIONS FOR THE LOGGED-IN USER
exports.getMySessions = async (req, res) => {
    try {
        const sessions = await Session.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate("questions");
        
        res.status(201).json(sessions);

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET SESSION BY ID FOR THE LOGGED-IN USER
exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate({
                path: "questions",
                options: { sort: { isPinned: -1, createdAt: -1 } },
            })
            .exec();

        if(!session) return res.status(404).json({ success: false, message: "Session Not Found" });

        res.status(201).json({ success: true, session });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET DELETE SESSION AND IT'S QUESTION
exports.deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if(!session) return res.status(404).json({ message: "Session Not Found" });

        if(session.user.toString() !== req.user.id) return res.status(401).json({ message: "Not authorized to delete this session" });

        //FIRST, DELETE ALL QUESTION LINKED TO THE CORRESPONDING SESSION
        await Question.deleteMany({ session: session._id });

        // THEN, DELETE THE SESSION ENTIRELY
        await session.deleteOne();

        res.status(200).json({ message: "Session got successfully deleted" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};