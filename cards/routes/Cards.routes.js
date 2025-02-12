import { Router } from "express";
import { Card } from "../models/Cards.schema.js";
import isAuthenticated from "../../middlewares/authMiddleware.js";
import checkAuthLevel from "../../middlewares/checkAuthLevel.js";
import validate from "../../middlewares/validation.js";
import { createCardSchema, updateCardSchema } from "../validations/cardsValidations.js";

const router = Router();

router.get("/", async (req, res) => {

    try {
        const filters = {};
        if (req.query.title) {
            filters.title = { $regex: req.query.title, $options: "i" };
        }
        if (req.query.city) {
            filters["address.city"] = { $regex: req.query.city, $options: "i" };
        }
        if (req.query.country) {
            filters["address.country"] = { $regex: req.query.country, $options: "i" };
        }

        const cards = await Card.find(filters);

        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch cards" });
    }
});


router.get("/my-cards", isAuthenticated, async (req, res) => {
    try {
        const cards = await Card.find({ userId: req.user._id });
        res.status(200).json(cards);
    } catch (error) {
        console.error("Error fetching user's cards:", error.message);
        res.status(500).json({ error: "Failed to fetch user's cards" });
    }
});

router.get("/liked", isAuthenticated, async (req, res) => {
    try {
        const likedCards = await Card.find({ likes: req.user._id });
        res.status(200).json(likedCards);
    } catch (error) {
        console.error("Error fetching liked cards:", error.message);
        res.status(500).json({ error: "Failed to fetch liked cards" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid card ID" });
        }

        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ error: "Card not found" });

        res.status(200).json(card);
    } catch (error) {
        console.error("Error fetching card:", error.message);
        res.status(500).json({ error: "Failed to fetch card" });
    }
});

router.post("/", isAuthenticated, checkAuthLevel("business"), validate(createCardSchema), async (req, res) => {
    try {
        let bizNumber;
        let isUnique = false;

        while (!isUnique) {
            bizNumber = Math.floor(100000 + Math.random() * 900000);
            const existingCard = await Card.findOne({ bizNumber });
            if (!existingCard) isUnique = true;
        }

        const card = new Card({
            ...req.body,
            userId: req.user._id,
            bizNumber,
        });

        await card.save();
        res.status(201).json(card);
    } catch (error) {
        console.error("Error creating card:", error.message);
        res.status(500).json({ error: "Failed to create card" });
    }
});

router.put("/:id", isAuthenticated, checkAuthLevel("business"), validate(updateCardSchema), async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid card ID" });
        }

        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ error: "Card not found" });

        if (card.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You can only edit your own cards" });
        }

        const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedCard);
    } catch (error) {
        console.error("Error updating card:", error.message);
        res.status(500).json({ error: "Failed to update card" });
    }
});

router.patch("/:id", isAuthenticated, async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid card ID" });
        }

        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ error: "Card not found" });

        const userId = req.user._id;
        const index = card.likes.indexOf(userId);

        if (index !== -1) {
            card.likes.splice(index, 1);
        } else {
            card.likes.push(userId);
        }

        await card.save();
        res.status(200).json(card);
    } catch (error) {
        console.error("Error liking/unliking card:", error.message);
        res.status(500).json({ error: "Failed to like/unlike card" });
    }
});

router.delete("/:id", isAuthenticated, checkAuthLevel("business"), async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid card ID" });
        }

        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ error: "Card not found" });

        if (card.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ error: "You can only delete your own cards" });
        }

        await Card.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Card deleted successfully" });
    } catch (error) {
        console.error("Error deleting card:", error.message);
        res.status(500).json({ error: "Failed to delete card" });
    }
});

export default router;
