import { GoogleGenAI } from "@google/genai";
import { recipePrompt, dishExplainPrompt } from "../utils/prompts.js";

//NEVER EVER PUT THE AI HERE EVER AGAIN

// GENERATE RECIPES AND SUGGESTIONS USING GEMINI
export const generateRecipes = async (req, res) => {
    try {
        const { numberOfRecipes, ingredients,
            allProducts, recentItems,
            description } = req.body;

        if (!numberOfRecipes)
            return res.status(400).json({ message: "Missing required fields" });

        let cartItems;

        // Use ingredients from frontend if provided
        if (ingredients && ingredients.length > 0)
            cartItems = ingredients;

        // if ((!cartItems || Object.keys(cartItems).length === 0) && !allProducts && !recentItems)
        //     return res.status(400).json({ message: "No ingredients found!" });

        // console.log("Cart Items:", cartItems);

        const prompt = recipePrompt(cartItems, numberOfRecipes, allProducts, recentItems, description);

        // console.log("Prompt:", prompt);

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        let rawText = response.text || "";

        // CLEAN THE TEXT: extract JSON safely from markdown fences or raw text
        const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/i) || rawText.match(/```\s*([\s\S]*?)\s*```/i);
        const textToParse = (jsonMatch ? jsonMatch[1] : rawText).trim();

        const data = JSON.parse(textToParse);

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: "Failed to generate recipes", error: error.message });
    }
};

// GENERATE EXPLANATION FOR THE RECIPES
export const generateExplanation = async (req, res) => {
    try {
        const { ingredients, dishName } = req.body;

        const cartItems = ingredients;

        // if (!cartItems || Object.keys(cartItems).length === 0) return res.status(400).json({ message: "No ingredients found in cartItems" });

        const prompt = dishExplainPrompt(cartItems, dishName);

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        let rawText = response.text || "";

        // CLEAN THE TEXT: extract JSON safely from markdown fences or raw text
        const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/i) || rawText.match(/```\s*([\s\S]*?)\s*```/i);
        const textToParse = (jsonMatch ? jsonMatch[1] : rawText).trim();

        const data = JSON.parse(textToParse);

        // console.log("AI Response:", data);

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: "Failed to generate recipe explanation", error: error.message });
    }
};