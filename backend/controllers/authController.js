import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Order from "../models/Order.js";
import mongoose from "mongoose";

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

//FOR HISTORY -> /api/auth/history
export const showAllOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });

        const orders = await Order.find({ 
            userId
        })
            .populate("items.product")
            .sort({ createdAt: -1 });

        const history = orders.map(order => ({
            orderId: order._id,
            date: order.createdAt,
            paymentType: order.paymentType,
            isPaid: order.isPaid,
            amount: order.amount,
            address: order.address,
            status: order.status,
            items: order.items.map(item => ({
                productId: item.product?._id,
                name: item.product?.name || "No name",
                quantity: item.quantity || 1,
                price: item.product?.price || 0,
                image: item.product?.image || [],
                category: item.product?.category || "Not Categorized",
                offerPrice: item.product?.offerPrice || item.product?.price || 0
            }))
        }));

        res.json({ success: true, history });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

//FOR SELLER (ALL ORDERS FROM USERS) -> /api/auth/allOrders
export const sellerOrders = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "seller") {
      return res.status(403).json({ success: false, message: "Access denied: Seller role required" });
    }

    const orders = await Order.find({})
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });

    const history = orders.map(order => ({
      orderId: order._id,
      date: order.createdAt,
      paymentType: order.paymentType,
      isPaid: order.isPaid,
      amount: order.amount,
      address: order.address,
      status: order.status,
      items: order.items.map(item => ({
        productId: item.product?._id,
        name: item.product?.name || "No name",
        quantity: item.quantity || 1,
        price: item.product?.price || 0,
        image: item.product?.image || [],
        category: item.product?.category || "Not Categorized",
        offerPrice: item.product?.offerPrice || item.product?.price || 0
      }))
    }));

    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};