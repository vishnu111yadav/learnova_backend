import { Router } from "express";
import { Agent } from "../agent/agentEngine";
import { tools } from "../agent/tools";

const router = Router();
const agent = new Agent(tools);

router.post("/ask", async (req, res) => {
    try {
        const { message } = req.body;
        console.log("Received message for agent:", message);
        if (!message) return res.status(400).json({ error: "Message required" });

        const response = await agent.run("deepseek-r1", message);
        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
