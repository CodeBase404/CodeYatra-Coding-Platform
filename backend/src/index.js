const express = require("express");
const connectToDb = require("./configs/db");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");
const problemRouter = require("./routes/problem.routes");
const rediClient = require("./configs/redis");
const submitRouter = require("./routes/submit.routes");
const cors = require("cors");
const chatRouter = require("./routes/chat.routes");
const videoRouter = require("./routes/video.routes");
const contestRouter = require("./routes/contest.routes");
const dailyChallengeRouter = require("./routes/dailyChallenge.routes");
const http = require("http");
const socketio = require("socket.io");
const DailyChallenge = require("./models/dailyChallenge.model");
const Problem = require("./models/problem.model");
const cron = require("node-cron");
const imageRouter = require("./routes/image.routes");
const paymentRouter = require("./routes/payment.routes");
const commentRouter = require("./routes/comment.routes");

const port = process.env.PORT;
const app = express();
const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);
  socket.on("join-problem", (problemId) => {
    socket.join(problemId);
    console.log(`Socket ${socket.id} joined room: ${problemId}`);
  });

  socket.on("leave-problem", (problemId) => {
    socket.leave(problemId);
    console.log(`Socket ${socket.id} left room: ${problemId}`);
  });

  socket.on("join-contest", (contestId) => {
    socket.join(contestId);
    console.log(`Socket ${socket.id} joined room ${contestId}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/chat", chatRouter);
app.use("/video", videoRouter);
app.use("/image", imageRouter);
app.use("/contest", contestRouter);
app.use("/daily-challenge", dailyChallengeRouter);
app.use("/payment", paymentRouter);
app.use("/comments", commentRouter);

cron.schedule(
  "0 9 * * *",
  async () => {
    const today = new Date().toISOString().split("T")[0];

    try {
      const recentChallenges = await DailyChallenge.find()
        .sort({ date: -1 })
        .limit(7);

      const usedProblemIds = recentChallenges.map((entry) => entry.problemId);

      const random = await Problem.aggregate([
        { $match: { _id: { $nin: usedProblemIds } } },
        { $sample: { size: 1 } },
      ]);

      if (random.length > 0) {
        await DailyChallenge.findOneAndUpdate(
          { date: today },
          { problemId: random[0]._id },
          { upsert: true }
        );
        console.log(`Daily challenge set for ${today}: ${random[0]._id}`);
      } else {
        console.log("No new problems available to set as daily challenge.");
      }
    } catch (error) {
      console.error("Error setting daily challenge:", error);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);

const startServer = async () => {
  try {
    await Promise.all([connectToDb(), rediClient.connect()]);
    console.log("✅ Database connected successfully");

    server.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
};

startServer();
// // TEMP trigger for manual testing
// (async () => {
//   const today = new Date().toISOString().split("T")[0];
//   const random = await Problem.aggregate([{ $sample: { size: 1 } }]);

//   if (random.length > 0) {
//     await DailyChallenge.findOneAndUpdate(
//       { date: today },
//       { problemId: random[0]._id },
//       { upsert: true }
//     );
//     console.log(`✅ Daily challenge set for ${today}`);
//   }
// })();
