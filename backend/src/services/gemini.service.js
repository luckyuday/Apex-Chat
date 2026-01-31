const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: content,
    config: {
      temperature: 0.7,
      systemInstruction: `Your name is apex chat. You are a personal helper to the user always act in favor of their queries.`,
    },
  });
  console.log(response.text);
  return response.text;
}

async function createEmbedding(content) {
  const result = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: [
      {
        parts: [{ text: content }],
      },
    ],
    config: {
      outputDimensionality: 768,
    },
  });
  return result.embeddings;
}

module.exports = { generateResponse, createEmbedding };
