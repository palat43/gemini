require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { chatPrompt, fileChat, chatHistoryPrompt } = require("./gemini");

const app = express();
const PORT = 8000;
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { chat } = req.body;
  const result = await chatPrompt(chat);
  return res.json({ result });
});

app.post("/api/file-chat", upload.single("file"), async (req, res) => {
  const file = req.file;
  const { chat } = req.body;
  if (!file) {
    return res.status(400).json({ message: "File not found" });
  }
  if (!chat) {
    return res.status(400).json({ message: "Chat prompt not found" });
  }

  const fileData = file.buffer.toString("base64");
  const fileMimeType = file.mimetype;
  const result = await fileChat(chat, fileData, fileMimeType);

  return res.json({ result });
});

app.post("/api/history", async (req, res) => {
  const { chat, history } = req.body;
  const result = await chatHistoryPrompt(chat, history);
  return res.json({ result });
});

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
