import mongoose, { Schema } from "mongoose";

const NoteSchema = new Schema(
    {
        text: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", default: null }
    },
    { timestamps: true }
);

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);
