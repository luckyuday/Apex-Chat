# 💬 Apex Chat
### A developer-focused AI chat assistant with long-term memory, powered by Gemini and Pinecone.

[🌐 Live Demo](https://apex-chat-noe0.onrender.com)

![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js)
![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-black?style=for-the-badge&logo=socket.io)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge&logo=mongodb)
![Pinecone](https://img.shields.io/badge/VectorDB-Pinecone-purple?style=for-the-badge)

---

## 📖 Overview

**Apex Chat** is a full-stack AI chat application built for developers. Ask coding questions, debug errors, or explore concepts — and unlike typical AI tools, Apex Chat **actually remembers your past conversations**.

Conversations are embedded using **Gemini Embeddings** and stored in **Pinecone**, a vector database, enabling the assistant to retrieve relevant context from previous sessions. This gives the AI genuine long-term memory rather than a one-off chat window.

The app combines a **REST API** for chat and user management with **WebSocket communication** for real-time AI responses, and **MongoDB** for persistent chat storage.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Vite, Tailwind CSS, RTK Query |
| **Backend** | Node.js, Express.js, Socket.IO |
| **Database** | MongoDB Atlas |
| **Vector Database** | Pinecone |
| **AI Model** | Google Gemini API |
| **Embeddings** | Gemini Embeddings |
| **Auth** | JWT |
| **Deployment** | Render |

---

## ✨ Features

- 🤖 AI responses powered by **Google Gemini**, tuned for coding questions
- 🧠 **Long-term memory** via Gemini embeddings stored in Pinecone
- ⚡ Real-time communication via **WebSockets**
- 🔐 Secure user authentication with **JWT**
- 💾 Persistent chat history stored in **MongoDB**
- 🗂 Chats sorted by last activity
- 📱 Fully responsive UI

---

## 🧠 How Long-Term Memory Works

1. When you send a message, it is embedded using **Gemini Embeddings**
2. The embedding is stored in **Pinecone** alongside the message content
3. On each new message, semantically similar past conversations are retrieved from Pinecone
4. The retrieved context is injected into the Gemini prompt, giving the AI memory of relevant past interactions

This allows Apex Chat to reference things you've discussed in previous sessions — making it a genuinely context-aware assistant rather than a stateless chatbot.

---

## 🚀 Getting Started

### Clone the repository
```bash
git clone https://github.com/luckyuday/Apex-Chat.git
cd Apex-Chat
```

### Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Run the Application
```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_pinecone_index_name
```

---

## 🚧 Upcoming Features

- 🎨 Code syntax highlighting in responses
- 📤 Export chat history as PDF
- 🔔 Message notifications
- 📎 File / image upload for code review

---

## 👨‍💻 Author

**Uday Kumar Verma**
[GitHub](https://github.com/luckyuday)

---

*Built to demonstrate real-time AI integration with long-term semantic memory in a full-stack JavaScript application.*
