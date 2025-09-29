import { GoogleGenAI } from "@google/genai";
import { recipePrompt, dishExplainPrompt } from "../utils/prompts.js";
import User from "../models/User.js";

//NEVER EVER PUT THE AI HERE EVER AGAIN

// GENERATE RECIPES AND SUGGESTIONS USING GEMINI
export const generateRecipes = async (req, res) => {
    try {
        const { userId, numberOfRecipes } = req.body;

        if (!userId || !numberOfRecipes)
            return res.status(400).json({ message: "Missing required fields" });

        const user = await User.findById(userId);

        if (!user)
            return res.status(404).json({ message: "User not found" });

        const cartItems = user.cartItems;

        if (!cartItems || Object.keys(cartItems).length === 0) return res.status(400).json({ message: "No ingredients found in cartItems" });

        // console.log("Cart Items:", cartItems);

        const prompt = recipePrompt(cartItems, numberOfRecipes);

        // console.log("Prompt:", prompt);

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        let rawText = response.text;

        // CLEAN THE TEXT: remove ```json and ``` from beginning until end
        const cleanText = rawText
            .replace(/^```json\s*/, "")     //remove starting ```json
            .replace(/```$/, "")    //remove ending ```
            .trim();    //remove extra spaces

        const data = JSON.parse(cleanText);

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: "Failed to generate recipes", error: error.message });
    }
};

// GENERATE EXPLANATION FOR THE RECIPES
export const generateExplanation = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId)
            return res.status(400).json({ message: "Missing required fields" });

        const user = await User.findById(userId);

        if (!user)
            return res.status(404).json({ message: "User not found" });

        const cartItems = user.cartItems;

        if (!cartItems || Object.keys(cartItems).length === 0) return res.status(400).json({ message: "No ingredients found in cartItems" });

        const prompt = dishExplainPrompt(cartItems);

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        let rawText = response.text;

        // CLEAN THE TEXT: remove ```json and ``` from beginning until end
        const cleanText = rawText
            .replace(/^```json\s*/, "")     //remove starting ```json
            .replace(/```$/, "")    //remove ending ```
            .trim();    //remove extra spaces

        const data = JSON.parse(cleanText);

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: "Failed to generate questions", error: error.message });
    }
};