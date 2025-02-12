import express from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "../models/User.schema.js";
import { createUserSchema } from "../validations/createUser.schema.js";
import { generateToken } from "../../services/auth.service.js";
import isAuthenticated from "../../middlewares/authMiddleware.js";
import checkAuthLevel from "../../middlewares/checkAuthLevel.js";
import isUser from "../../middlewares/isUser.js";
import validate from "../../middlewares/validation.js";
import { validateLoginUser } from "../validations/loginUser.schema.js";
import { updateUserSchema } from "../validations/updateUser.schema.js";

const router = express.Router();

router.get("/", isAuthenticated, checkAuthLevel(3), async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

router.post("/register", validate(createUserSchema), async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({ ...req.body, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Error registering user:", error.message);
        res.status(500).json({ error: "Failed to register user" });
    }
});

router.post("/login", validateLoginUser, async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = generateToken(user);

        res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/:id", isAuthenticated, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (req.user._id !== user._id.toString() && req.user.authLevel < 3) {
            return res.status(403).json({ error: "Access denied" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

router.put("/:id", isAuthenticated, checkAuthLevel("admin"), validate(updateUserSchema), async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        if (req.body.email) {
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser && existingUser._id.toString() !== req.params.id) {
                return res.status(400).json({ error: "Email already in use" });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
});


router.delete("/:id", isAuthenticated, isUser, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

router.patch("/:id/business", isAuthenticated, isUser, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { isBusiness: req.body.isBusiness },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating business status:", error.message);
        res.status(500).json({ error: "Failed to update business status" });
    }
});

export default router;
