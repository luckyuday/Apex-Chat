import type { Message } from "./message";

export interface ServerToClientEvents {
  aiResponse: (message: Message) => void;
}

export interface ClientToServerEvents {
  aiMessage: ({ chat, content }: { chat: string; content: string }) => void;
}
