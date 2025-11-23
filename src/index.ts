import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";
import ollamaRoutes from "./routes/ollama";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/ollama", ollamaRoutes);

app.get("/", (req, res) => {
    res.send("Learnova Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
