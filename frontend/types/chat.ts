export interface chat {
  _id: string;
  title: string;
  lastActivity: string;
  user: string;
}

export interface createChat {
  title: string;
}

export interface chatResponse {
  message: string;
  chat: chat;
}
