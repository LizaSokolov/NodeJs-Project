const isUser = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: Please log in" });
        }

        const userIdFromRequest = req.params.id?.toString() || req.body.userId?.toString();

        const authenticatedUserId = req.user._id?.toString() || req.user.userId?.toString();

        if (req.user.authLevel === 3 || authenticatedUserId === userIdFromRequest) {
            return next();
        }

        return res.status(403).json({ error: "Forbidden: You do not have access to this resource" });

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export default isUser;
