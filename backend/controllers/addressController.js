import Address from "../models/Address.js";

// ADD ADDRESS -> /api/address/add
export const addAddress = async (req, res) => {
    try {
        const { address, userId } = req.body;
        const targetUserId = req.user?._id || userId;

        await Address.create({ ...address, userId: targetUserId });

        res.json({ success: true, message: "Address added successfully!" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }  
};

// GET ADDRESS -> /api/address/get
export const getAddress = async (req, res) => {
    try {
        const targetUserId = req.user?._id || req.query.userId;
        const addresses = await Address.find({ userId: targetUserId });

        res.json({ success: true, addresses });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }  
};