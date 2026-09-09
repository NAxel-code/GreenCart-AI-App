import User from "../models/User.js";

//UPDATE USER'S CART -> /api/cart/update

export const updateCart = async (req, res) => {
    try {
        const userId = req.user?._id || req.body.userId;
        const { cartItems } = req.body;

        if (!userId || !cartItems || typeof cartItems !== 'object') 
            return res.status(400).json({ success: false, message: "Missing or invalid fields" });

        const updatedUser = await User.findByIdAndUpdate(userId, { cartItems }, { new: true });
        
        res.json({ success: true, message: "Cart Updated!", user: updatedUser });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

