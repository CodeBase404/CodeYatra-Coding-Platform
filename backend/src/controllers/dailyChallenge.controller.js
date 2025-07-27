const DailyChallenge = require("../models/dailyChallenge.model");
const User = require("../models/user.model");

const markDailyChallengeSolved = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { problemId } = req.body;
    if (!problemId) return res.status(400).json({ message: "problemId required" });

    const today = new Date().toISOString().split("T")[0];

    const existing = user.dailyChallengeHistory.find(
      (d) => d.date === today && d.problemId.toString() === problemId
    );

    if (!existing) {
      user.dailyChallengeHistory.push({
        date: today,
        problemId,
        solved: true,
      });
      await user.save();
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const getDailyChallenge = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const today = new Date().toISOString().split("T")[0];
    const todayChallenge = await DailyChallenge.findOne({ date: today }).populate("problemId");

    if (!todayChallenge) {
      return res.status(404).json({ message: "No challenge for today" });
    }

    const isSolved = user.dailyChallengeHistory.some(
      (entry) =>
        entry.date === today &&
        entry.problemId.toString() === todayChallenge.problemId._id.toString() &&
        entry.solved === true
    );

    res.json({
      challenge: todayChallenge,
      isSolved,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { getDailyChallenge, markDailyChallengeSolved};
