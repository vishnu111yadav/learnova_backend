import { Router } from "express";
import OllamaRequest from "../models/OllamaRequest";
import { callOllama } from "../utils/callOllama";

const router = Router();

// POST /api/ollama/generate
router.post("/generate", async (req, res) => {
    try {
        const { model, prompt, options } = req.body;

        if (!model || !prompt) {
            return res.status(400).json({ error: "model and prompt are required" });
        }

        // Save request as queued
        const entry = await OllamaRequest.create({
            model,
            prompt,
            options: options || {},
            status: "queued"
        });
        
        // Call Ollama
        const response = await callOllama(model, prompt, options);

        // Update DB
        entry.status = "done";
        entry.response = response;
        await entry.save();

        res.json({ success: true, id: entry._id, response });
    } catch (error: any) {
        console.error("Ollama backend error:", error);

        res.status(500).json({ error: error.message || "Server error" });
    }
});

// GET /api/ollama/history
router.get("/history", async (req, res) => {
    const data = await OllamaRequest.find().sort({ createdAt: -1 });
    res.json(data);
});

export default router;
