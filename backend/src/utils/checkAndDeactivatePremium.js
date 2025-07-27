const dayjs = require("dayjs");

async function checkAndDeactivatePremium(user) {
  if (
    user.premiumPlan?.isActive &&
    user.premiumPlan?.endDate &&
    dayjs().isAfter(dayjs(user.premiumPlan.endDate))
  ) {
    user.premiumPlan.isActive = false;
    user.premiumPlan.type = "none";
    user.premiumPlan.startDate = null;
    user.premiumPlan.endDate = null;
    await user.save();
  }
}

module.exports = checkAndDeactivatePremium;
