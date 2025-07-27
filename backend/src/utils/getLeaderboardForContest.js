const Contest = require("../models/contest.model");
const Submission = require("../models/submission.model");

const getLeaderboardForContest = async (contestId) => {
  const contest = await Contest.findById(contestId).lean();
   if (!contest) throw new Error("Contest not found");

  const problems = contest.problems.map((id) => id.toString());
  const contestStartTime = new Date(contest.startTime).getTime();

  const submissions = await Submission.find({
    contestId,
    status: { $in: ["accepted", "wrong answer"] },
  })
    .sort({ createdAt: 1 })
    .populate("userId", "firstName emailId");

  const userMap = new Map();

  for (const sub of submissions) {
    const userId = sub.userId._id.toString();
    const problemId = sub.problemId.toString();
    const isAccepted = sub.status === "accepted";

    if (!userMap.has(userId)) {
      userMap.set(userId, {
        user: sub.userId,
        score: 0,
        finishTime: null,
        questions: {},
         lastAcceptedTime: new Date(contest.startTime).getTime(),
      });
    }

    const userData = userMap.get(userId);

    if (!userData.questions[problemId]) {
      const subTime = new Date(sub.createdAt).getTime();
      const diff = subTime - userData.lastAcceptedTime;
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      const timeTaken = `${minutes}m ${seconds}s`;

      userData.questions[problemId] = {
        status: isAccepted ? "accepted" : "wrong",
        time: new Date(sub.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timeTaken: isAccepted ? timeTaken : null,
        language: sub.language,
        penalty: 0,
      };

      if (isAccepted) {
        userData.score += 1;
        userData.finishTime = sub.createdAt;
        userData.lastAcceptedTime = subTime; 
      }
    }
  }

  // Fill unattempted
  for (const [ ,data] of userMap.entries()) {
    for (const probId of problems) {
      if (!data.questions[probId]) {
        data.questions[probId] = { status: "unattempted" };
      }
    }
  }

  const leaderboard = Array.from(userMap.values()).map((entry) => {
    const finishTimestamp = entry.finishTime
      ? new Date(entry.finishTime).getTime()
      : null;

    let timeTaken = "--:--";
    if (finishTimestamp && finishTimestamp > contestStartTime) {
      const diff = finishTimestamp - contestStartTime;
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      timeTaken = `${minutes}m ${seconds}s`;
    }

    return {
      rank: 0,
      name: entry.user.firstName || entry.user.emailId.split("@")[0],
      score: entry.score,
      finishTime: entry.finishTime
        ? new Date(entry.finishTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "--:--",
      timeTaken,
      finishTimestamp,
      questions: entry.questions,
      userId: entry.user._id,
    };
  });

  leaderboard.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
       return new Date(a.finishTime) - new Date(b.finishTime);
  });

  leaderboard.forEach((entry, idx) => {
    entry.rank = idx + 1;
  });
  console.log(leaderboard);
  
  return leaderboard;
};

module.exports = { getLeaderboardForContest };
