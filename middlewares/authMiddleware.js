import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: "Server misconfiguration: JWT_SECRET is missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid token", details: error.message });
    }
};

export default isAuthenticated;
