const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const fileToGenerativePart = (imageData, mimeType) => {
  return {
    inlineData: {
      data: imageData,
      mimeType,
    },
  };
};

const fileChat = async (prompt, fileData, mimeType) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const fileParts = [fileToGenerativePart(fileData, mimeType)];
  const result = await model.generateContent([prompt, ...fileParts]);
  const response = result.response;
  const text = response.text();
  return text;
};

const chatPrompt = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
};

const chatHistoryPrompt = async (prompt, history) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const chat = model.startChat({
    history,
  });

  const result = await chat.sendMessage(prompt);
  const response = result.response;
  const text = response.text();
  return text;
};

module.exports = {
  fileChat,
  chatPrompt,
  chatHistoryPrompt,
};
