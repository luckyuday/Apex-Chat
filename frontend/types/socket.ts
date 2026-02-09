export interface ServerToClientEvents {
  aiResponse: ({ chat, content }: { chat: string; content: string }) => void;
}

export interface ClientToServerEvents {
  aiMessage: ({ chat, content }: { chat: string; content: string }) => void;
}
