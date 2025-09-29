import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//GENERATE JWT TOKEN
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc -> Register a new user
// @route -> POST /api/auth/register
// @access -> Public

//REGISTER USER
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl, role } = req.body;

        //VALIDATION -> CHECKING FOR MISSING FIELDS
        if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

        //CHECK IF EMAIL ALREADY EXISTS
        const userExists = await User.findOne({ email });

        if (userExists) return res.status(400).json({ message: "User already existed" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //CREATE NEW USER
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (err) {
        res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }

};

// @desc -> Login user
// @route -> POST /api/auth/login
// @access -> Public

//LOGIN USER
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "All fields are required" });

    try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({ message: "Invalid Credentials" });

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (err) {
        res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }

};

// @desc ->Get user profile
// @route -> POST /api/auth/profile
// @access -> Public

//Get User Info
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);

    } catch (err) {
        res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};