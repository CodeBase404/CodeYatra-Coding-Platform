const Contest = require("../models/contest.model");
const Problem = require("../models/problem.model");
const Submission = require("../models/submission.model");
const {
  getLeaderboardForContest,
} = require("../utils/getLeaderboardForContest");
const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");

const submitCode = async (req, res) => {
  try {
    const userId = req.user._id;
    const problemId = req.params.id;
    const { code, language, contestId } = req.body;

    if (!userId || !problemId || !code || !language) {
      return res.status(400).json({ message: "Required field is missing" });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const languageId = getLanguageById(language);
    if (!languageId) {
      return res.status(400).json({ message: "Invalid language provided" });
    }

    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesTotal: problem.hiddenTestCases.length,
      contestId: contestId || null,
    });

    // creating batch submission
    const submissions = problem.hiddenTestCases.map(({ input, output }) => ({
      source_code: code,
      language_id: languageId,
      stdin: input,
      expected_output: output,
    }));

    const submitResult = await submitBatch(submissions);
    if (!submitResult || !Array.isArray(submitResult)) {
      console.error("submission failed:");
      return res
        .status(502)
        .json({ message: "submission failed. Please try again." });
    }
    const resultToken = submitResult.map((res) => res.token);
    const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "accepted";
    let errorMessage = null;

    for (const test of testResult) {
      if (test.status_id == 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time) || 0;
        memory = Math.max(memory, test.memory || 0);
      } else {
        if (test.status_id == 4) {
          status = "wrong answer";
          errorMessage = test.stderr;
        } else {
          status = "error";
          errorMessage = test.stderr || test.compile_output;
        }
      }
    }

    if (contestId) {
      const contest = await Contest.findById(contestId);

      if (!contest) {
        return res.status(404).json({ message: "Contest not found" });
      }
    }

    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;
    await submittedResult.save();

    if (status === "accepted" && !req.user.problemSolved.includes(problemId)) {
      req.user.problemSolved.push(problemId);
      await req.user.save();
    }

    if (contestId && status === "accepted") {
      const alreadyAccepted = await Submission.findOne({
        userId,
        problemId,
        contestId,
        status: "accepted",
      });

      // 🎯 Emit leaderboard update only in contest mode
      if (
        !alreadyAccepted ||
        alreadyAccepted._id.toString() === submittedResult._id.toString()
      ) {
        const leaderboard = await getLeaderboardForContest(contestId);

        const io = req.app.get("io");
        io.to(contestId.toString()).emit("leaderboard:update", leaderboard);
      }
    }

    res.status(201).json({
      code,
      language,
      status,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory,
      createdAt: submittedResult.createdAt,
      _id: submittedResult._id,
      message: "Submission successfully",
    });
  } catch (error) {
    console.error("Submit error:", error);
    res.status(500).json({ message: "Something went wrong during submission" });
  }
};

const runCode = async (req, res) => {
  try {
    const userId = req.user._id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    if (!userId || !problemId || !code || !language) {
      return res.status(400).json({ message: "Required field is missing" });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const languageId = getLanguageById(language);
    if (!languageId) {
      return res.status(400).json({ message: "Invalid language provided" });
    }

    // creating batch submission
    const submissions = problem.visibleTestCases.map(({ input, output }) => ({
      source_code: code,
      language_id: languageId,
      stdin: input,
      expected_output: output,
    }));

    const submitResult = await submitBatch(submissions);
    if (!submitResult || !Array.isArray(submitResult)) {
      console.error("submission failed:");
      return res
        .status(502)
        .json({ message: "submission failed. Please try again." });
    }
    const resultToken = submitResult.map((res) => res.token);
    const testResult = await submitToken(resultToken);

    const runresult = testResult.map((result) => {
      const {
        source_code,
        language: { name: languageName },
        stdin,
        expected_output,
        stdout,
        status: { description: statusDesc },
        time,
        memory,
        created_at,
        finished_at,
        token,
      } = result;

      return {
        source_code,
        languageName,
        stdin,
        expected_output,
        stdout,
        statusDesc,
        time,
        memory,
        created_at,
        finished_at,
        token,
      };
    });

    res.status(200).send(runresult);
  } catch (error) {
    console.error("Submit error:", error);
    res.status(500).json({ message: "Something went wrong during submission" });
  }
};

const getSubmissionsById = async (req, res) => {
  const userId = req.user._id;
  const problemId = req.params.id;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User not found" });
    }

    const existingSubmission = await Submission.find({ userId, problemId });

    if (existingSubmission.length == 0) {
      return res.status(200).send("No Submission is present");
    }

    res.status(200).json({
      submission: existingSubmission,
    });
  } catch (error) {
    console.error("Update error:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getAllSubmissions = async (req, res) => {
  const userId = req.user._id;
  try {
    const submission = await Submission.find({ userId })
      .populate({
        path: "problemId",
        select: "title",
      })
      .populate({ path: "userId", select: "firstName" });
      

   if (submission.length === 0) {
      return res.status(200).json({
        message: "No Submission is present",
        submission: [],
        groupedSubmissions: {},
      });
    }

     const groupedSubmissions = {};
    submission.forEach((sub) => {
      const date = new Date(sub.createdAt).toISOString().split("T")[0];
      if (!groupedSubmissions[date]) groupedSubmissions[date] = [];

      groupedSubmissions[date].push({
        title: sub?.problemId?.title,
        status: sub?.status,
        language: sub?.language,
      });
    });

    res.status(200).json({
      submission, // full list of submissions
      groupedSubmissions, // for calendar tooltip
    });
  } catch (error) {
    console.error("Update error:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getLastSubmission = async (req, res) => {
  try {
    const { problemId, language } = req.params;
    const userId = req.user._id;

    const lastSubmission = await Submission.findOne({
      problemId,
      language,
      userId,
    })
      .sort({ createdAt: -1 })
      .select("problemId code language createdAt");

    if (!lastSubmission) {
      return res.status(404).json({ message: "No submissions found" });
    }

    res.status(200).json(lastSubmission);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  submitCode,
  runCode,
  getSubmissionsById,
  getAllSubmissions,
  getLastSubmission,
};
