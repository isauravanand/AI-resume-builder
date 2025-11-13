const jwt = require("jsonwebtoken");
const userModel = require("../models/users");

const verifyToken = async (req, res, next) => {
    try {
        const token =
            req.cookies?.token ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Please log in first.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid token or user not found.",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Session expired. Please log in again.",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token signature.",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Unauthorized access.",
        });
    }
};

module.exports = verifyToken;
