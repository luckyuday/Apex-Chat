const { Pinecone } = require("@pinecone-database/pinecone");

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const indexName = process.env.PINECONE_INDEX || "chat-gpt";
const gptindex = pc.index(indexName);

// Pinecone metadata filters are type-strict, so IDs are stored as strings
// and every filter (user/chat) must use string values too.
function normalizeMetadata(metadata) {
  return {
    ...metadata,
    user: String(metadata.user),
    chat: String(metadata.chat),
  };
}

async function createMemory({ vectors, metadata, messageId }) {
  await gptindex.upsert([
    {
      id: messageId,
      values: vectors[0].values,
      metadata: normalizeMetadata(metadata),
    },
  ]);
}

async function queryMemory({ limit = 5, vectors, filter }) {
  const data = await gptindex.query({
    vector: vectors[0].values,
    topK: limit,
    filter: filter ?? null,
    includeMetadata: true,
  });

  return data.matches;
}

// Remove every vector stored for a given chat (user's long-term memory for it).
async function deleteMemoriesByChat(chatId) {
  await gptindex.deleteMany({ chat: chatId });
}

module.exports = { createMemory, queryMemory, deleteMemoriesByChat };
