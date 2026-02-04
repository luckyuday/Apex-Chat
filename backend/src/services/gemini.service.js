const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(content) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: content,
      config: {
        temperature: 0.7,
        systemInstruction: `Your name is apex chat. You are a personal helper to the user always act in favor of their queries.`,
      },
    });
    return response.text;
  } catch (err) {
    console.log(err);
    throw new Error("Error Response from AI.");
  }
}

async function createEmbedding(content) {
  try {
    const result = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: content,
      config: {
        outputDimensionality: 768,
      },
    });
    return result.embeddings;
  } catch (err) {
    console.log(err);
    throw new Error("Embedding error");
  }
}

module.exports = { generateResponse, createEmbedding };
