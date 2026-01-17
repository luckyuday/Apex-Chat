const { Pinecone } = require("@pinecone-database/pinecone");

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const gptindex = pc.index("chat-gpt");

async function createMemory({ vectors, metadata, messageId }) {
  await gptindex.upsert([
    {
      id: messageId,
      values: vectors[0].values,
      metadata,
    },
  ]);
}

async function queryMemory({ limit = 5, vectors, metadata }) {
  const data = await gptindex.query({
    vector: vectors[0].values,
    topK: limit,
    filter: metadata ? { metadata } : undefined,
    includeMetadata: true,
  });
  return data.matches;
}

module.exports = { createMemory, queryMemory };
