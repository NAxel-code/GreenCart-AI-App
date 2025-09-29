import jwt from "jsonwebtoken";
import User from "../models/User.js";

//MIDDLEWARE TO PROTECT ROUTES
export const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) return res.status(401).json({ message: "User not found" });
            
            next();
        }
        else res.status(401).json({ message: "Not authorized, no token" });

    } catch (err) {
        res.status(401).json({ message: "Token failed", error: err.message });
    }
};

