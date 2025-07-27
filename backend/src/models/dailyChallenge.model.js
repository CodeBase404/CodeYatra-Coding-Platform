const mongoose = require("mongoose");

const dailyChallengeSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "problem",
    required: true,
  },
});

const DailyChallenge = mongoose.model("dailyChallenge", dailyChallengeSchema);
module.exports = DailyChallenge;
