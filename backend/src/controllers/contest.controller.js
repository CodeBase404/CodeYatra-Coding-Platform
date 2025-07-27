const Contest = require("../models/contest.model");
const {
  getLeaderboardForContest,
} = require("../utils/getLeaderboardForContest");

const createContest = async (req, res) => {
  try {
    const { name, problems, startTime, endTime } = req.body;
    const createdBy = req.user._id;

    const newContest = await Contest.create({
      name,
      problems,
      startTime,
      endTime,
      createdBy,
    });

    res.status(201).json({ message: "Contest created", contest: newContest });
  } catch (err) {
    console.error("Create Contest Error:", err);
    res.status(500).json({ message: "Failed to create contest" });
  }
};

const deleteContest = async (req, res) => {
  const { contestId } = req.params;

  try {
    if (!contestId) {
      return res.status(400).json({ message: "Missing Contest ID" });
    }

    const contest = await Contest.findByIdAndDelete(contestId);

    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    res.status(200).json({ message: "Contest deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getAllContests = async (req, res) => {
  try {
    const userId = req.user._id;

    const contests = await Contest.find()
      .populate({
        path: "problems",
        select: "_id title tags difficulty",
      })
      .lean();

    if (!contests) {
      return res.json({ message: "Contest not found" });
    }

    const contestsWithStatus = contests.map((c) => ({
      ...c,
      registered: c.registrations?.some(
        (r) => r.user.toString() === userId.toString()
      ),
    }));

    res.status(200).json({ contests: contestsWithStatus });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch contests" });
  }
};

const getContestProblems = async (req, res) => {
  try {
    const { contestId } = req.params;
    const contest = await Contest.findById(contestId).populate({
      path: "problems",
      select: "_id title tags difficulty",
    });

    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    res.status(200).json({ problems: contest.problems });
  } catch (err) {
    res.status(500).json({ message: "Error fetching contest problems" });
  }
};

const registerUser = async (req, res) => {
  const userId = req.user._id;
  const { contestId } = req.params;

  try {
    const contest = await Contest.findById(contestId);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    const alreadyRegistered = contest.registrations.some(
      (r) => r.user.toString() === userId.toString()
    );

    if (!alreadyRegistered) {
      contest.registrations.push({ user: userId, registeredAt: new Date() });
      await contest.save();
      return res.status(200).json({ message: "Successfully registered" });
    }

    res.status(200).json({ message: "Already registered" });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed" });
  }
};

const deregisterContest = async (req, res) => {
  const { contestId } = req.params;
  const userId = req.user._id;

  const contest = await Contest.findById(contestId);
  if (!contest) return res.status(404).json({ error: "Contest not found" });

  contest.registrations = contest.registrations.filter(
    (reg) => reg.user.toString() !== userId.toString()
  );

  await contest.save();
  res.status(200).json({ message: "Deregistered successfully" });
};


const getContestLeaderboard = async (req, res) => {
  const { contestId } = req.params;

  try {
    const contest = await Contest.findById(contestId).lean();
    const problems = contest.problems.map((id) => id.toString());
    const leaderboard = await getLeaderboardForContest(contestId);

    res.status(200).json({ leaderboard, problems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};

module.exports = {
  createContest,
  getAllContests,
  getContestLeaderboard,
  getContestProblems,
  deleteContest,
  registerUser,
  deregisterContest
};
