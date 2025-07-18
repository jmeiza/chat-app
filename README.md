# 💬 Full-Stack Real-Time Chat App

A modern full-stack chat application with real-time messaging, built using the MERN stack and Socket.io.

- 🔗 **Frontend**: https://chat-app-puce-iota.vercel.app/
---

## ⚙️ Tech Stack

### Frontend:
- React
- CSS Modules
- Vite
- Socket.io Client

### Backend:
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Socket.io Server

---

## 🧠 Features

- 🔐 User Authentication (JWT-based)
- 🧑‍🤝‍🧑 One-on-One Chat Creation
- 💬 Real-Time Messaging via Socket.io
- 📨 Message Persistence (MongoDB)

---

## 📁 Project Structure
<pre>```
chat-app/
│
├── server/ # Node/Express API
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── server.js
│
├── client/ # React frontend
│ ├── components/
│ ├── pages/
│ ├── utils/
│ └── App.js
```</pre>
---

## 🧪 Running Locally

> You’ll need Node.js and MongoDB installed locally, or use a cloud MongoDB URI.

1. **Clone this repo**
   ```bash
   git clone https://github.com/jmeiza/chat-app.git
   cd chat-app
   ```

2. **Set up environment variables**
    > Create a `.env` file inside `server/` with:
    ```env
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    PORT=8000
    ```

3. **Install dependencies**
    ```bash
    cd server && npm install
    cd ../client && npm install
    ```

4. **Start servers**
    # In server/
    npm run dev

    # In client/
    npm start

---

## 📦 Deployment
- Frontend deployed via Vercel
- Backend deployed via Render
- MongoDB hosted with MongoDB Atlas

