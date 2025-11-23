import mongoose from "mongoose";

const OllamaRequestSchema = new mongoose.Schema(
    {
        model: { type: String, required: true },
        prompt: { type: String, required: true },
        options: { type: Object, default: {} },
        response: { type: Object, default: null },
        status: { type: String, enum: ["queued", "done", "error"], default: "queued" },
        error: { type: String, default: null }
    },
    { timestamps: true }
);

export default mongoose.model("OllamaRequest", OllamaRequestSchema);
