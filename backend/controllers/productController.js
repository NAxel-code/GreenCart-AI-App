import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

// Add Product -> /api/product/add
export const addProduct = async (req, res) => {
    try {
        // console.log("Raw productData:", req.body.productData);
        let productData;
        try {
            productData = JSON.parse(req.body.productData);
        } catch (err) {
            return res.status(400).json({ success: false, message: "Invalid product data format" });
        }

        const { name, description, price, offerPrice, category } = productData;

        if (
            !name ||
            !description ||
            !price ||
            !offerPrice ||
            !category ||
            typeof name !== "string" ||
            typeof description !== "string" && !Array.isArray(description) ||
            typeof price !== "number" ||
            typeof offerPrice !== "number" ||
            typeof category !== "string"
        ) return res.status(400).json({ success: false, message: "Missing or invalid product fields" });

        
        const images = req.files || [];

        if (!Array.isArray(images) || images.length === 0) 
            return res.status(400).json({ success: false, message: "No images uploaded" });

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                try {
                    const result = await cloudinary.uploader.upload(item.path, {
                        resource_type: 'image',
                    });

                    return result.secure_url;

                } catch (err) {
                    console.error("Cloudinary upload failed:", err.message);
                    throw new Error("Image upload failed");
                }
            })
        )

        await Product.create({ ...productData, image: imagesUrl });

        // console.log("req.body:", req.body);
        // console.log("req.files:", req.files);

        res.json({ success: true, message: "Product Added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });

    }
};

// Get Product -> /api/product/list
export const productList = async (req, res) => {
    try {
        const products = await Product.find({})
        res.json({ success: true, products });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get Single Product -> /api/product/id
export const productById = async (req, res) => {
    try {
        const id = req.query.id || req.params.id || req.body?.id;
        if (!id) return res.status(400).json({ success: false, message: "Missing product id" });
        const product = await Product.findById(id);

        res.json({ success: true, product });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Change Product InStock -> /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;
        await Product.findByIdAndUpdate(id, { inStock });

        res.json({ success: true, message: "Stock Updated!" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};