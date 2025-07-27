const checkAndDeactivatePremium = require("../utils/checkAndDeactivatePremium");

const requirePremium = async (req, res, next) => {
  const user = req.user;
  await checkAndDeactivatePremium(user);

  if (user.premiumPlan?.isActive) {
    return next();
  }

  return res.status(403).json({ error: "Premium access required or expired." });
};

module.exports = requirePremium;
