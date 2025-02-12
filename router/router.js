import { Router } from "express";
import cardRoutes from "../cards/routes/Cards.routes.js"
import userRoutes from "../users/routes/User.routes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/cards", cardRoutes);

router.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

export default router;
