import User from "../models/User";
import Note from "../models/Note";

export const tools = {
    async getUser(input: { id: string }) {
        return await User.findById(input.id);
    },

    async saveNote(input: { text: string, userId?: string }) {
        return await Note.create({
            text: input.text,
            userId: input.userId || null,
        });
    },

    calculate(input: { expression: string }) {
        return eval(input.expression);
    }
};
