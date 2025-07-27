const aiFAQResponse = require("../configs/aiFAQResponse.js");
const main = require("../configs/generateAiResponse.js");
const Chat = require("../models/chat.model.js");

const solveDoubt = async (req, res) => {
  const { message, title, description, testCases, startCode } = req.body;
  const problemId = req.params.id;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({ userId, problemId });

    if (!chat) {
      chat = new Chat({ userId, problemId, messages: [] });
    }

    const MAX_HISTORY = 10;
    const promptMessage = [
      ...chat.messages.slice(-MAX_HISTORY),
      { role: "user", parts: [{ text: message }] },
    ];

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");

    const answer = await main({
      promptMessage,
      title,
      description,
      testCases,
      startCode,
    });

    let streamedText = "";

    for await (const chunk of answer) {
      const text = chunk.text || "";
      streamedText += text;
      res.write(text);
    }

    chat.messages.push({ role: "user", parts: [{ text: message }] });
    chat.messages.push({ role: "model", parts: [{ text: streamedText }] });

    await chat.save();

    res.end();
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
};

const platformDoubt = async (req, res) => {
  const { message } = req.body;
  console.log(message);

  try {
    const promptMessage = [{ role: "user", parts: [{ text: message }] }];

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");

    const answer = await aiFAQResponse({ promptMessage });

    for await (const chunk of answer) {
      const text = chunk.text || "";
      res.write(text);
    }

    res.end();
  } catch (err) {
    console.error("Platform doubt error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
};

const getChatById = async (req, res) => {
  const userId = req.user._id;
  const problemId = req.params.id;

  try {
    const chat = await Chat.find({ problemId, userId });

    if (!chat) {
      return res.status(404).json({ success: false, error: "Chat not found" });
    }

    res.json({ success: true, chat });
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const deleteChatById = async (req, res) => {
  const userId = req.user._id;
  const problemId = req.params.id;

  try {
    const deleted = await Chat.findOneAndDelete({ problemId, userId });

    if (!deleted) {
      return res.status(404).json({ success: false, error: "Chat not found" });
    }

    res.json({ success: true, message: "Chat deleted successfully" });
  } catch (err) {
    console.error("Error deleting chat:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = { solveDoubt, getChatById, deleteChatById, platformDoubt };
