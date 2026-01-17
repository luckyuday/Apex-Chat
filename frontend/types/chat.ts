interface ChatSession {
  _id: string;
  title: string;
  user: string;
}

interface Message {
  _id: string;
  user: string;
  chat: string;
  content: string;
  role: string;
}