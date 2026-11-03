import type { Message } from "./message";

export interface ServerToClientEvents {
  aiResponse: (message: Message) => void;
  // Streaming delta for the in-progress model answer.
  aiResponseChunk: (payload: { chat: string; delta: string }) => void;
}

export interface ClientToServerEvents {
  aiMessage: ({ chat, content }: { chat: string; content: string }) => void;
}
