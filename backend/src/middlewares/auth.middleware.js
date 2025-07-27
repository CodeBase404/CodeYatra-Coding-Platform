const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const rediClient = require("../configs/redis");

const createAuthMiddleware = (requiredRole = null) => {
  return async (req, res, next) => {
    try {
      const { token } = req.cookies;
      if (!token) {
        return res
          .status(401)
          .json({ error: "Unauthorized: Login Again" });
      }

      const payload = jwt.verify(token, process.env.JWT_KEY);
      const { _id, role } = payload;

      if (!_id || (requiredRole && role !== requiredRole)) {
        return res
          .status(401)
          .json({ error: "Unauthorized: Invalid token or role" });
      }

      const isBlocked = await rediClient.exists(`token:${token}`);
      if (isBlocked) {
        return res
          .status(401)
          .json({ error: "Unauthorized: Token has been revoked" });
      }

      const user = await User.findById(_id).select('-password');
      if (!user) {
        return res.status(401).json({ error: "Unauthorized: User not found" });
      }
      
      req.user = user;

      next();
    } catch (err) {
      console.error("Auth Error:", err.message);
      res.status(401).json({ error: "Unauthorized" });
    }
  };
};

module.exports = {
  userAuthMiddleware: createAuthMiddleware(),
  adminAuthMiddleware: createAuthMiddleware("admin"),
};
