import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    web: { type: String, default: "" },
    image: {
        url: { type: String, default: "" },
        alt: { type: String, default: "" },
    },
    bizNumber: { type: Number, unique: true, required: true },
    address: {
        state: { type: String, default: "" },
        country: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String, required: true },
        houseNumber: { type: String, required: true },
        zip: { type: String, required: true },
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
});

export const Card = mongoose.model("Card", CardSchema);
