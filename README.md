# TaskMaster Backend 🚀

The high-performance, real-time API powering the TaskMaster collaborative platform. Built with Node.js, Express, MongoDB, and Socket.io.

## 🛠️ Tech Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Real-time**: Socket.io
- **Security**: JWT, BcryptJS, Express-rate-limit, Zod
- **Logging**: Winston

## 📋 Features
- **User Authentication**: Secure JWT-based auth with cookie storage.
- **Task Management**: CRUD operations with role-based visibility.
- **Real-time Engine**: Instant updates for task creation, updates, and comments.
- **Activity Tracking**: Automated logging of every action taken on a task.
- **Robust Validation**: Strict schema enforcement using Zod.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables (see `.env.example`).
3. Run in development:
   ```bash
   npm run dev
   ```

## 🌍 Deployment (Render)

### 1. Host Database
Use **MongoDB Atlas** to get a connection string. Ensure IP Whitelisting allows Render's IP or `0.0.0.0/0`.

### 2. Configure Render
- **Build Command**: `npm install && npm run build`
- **Start Command**: `node dist/server.js`
- **Environment Variables**:
  - `PORT`: `4000` (Render fills this automatically, ensure your code uses `process.env.PORT`)
  - `MONGODB_URI`: Your Mongo connection string
  - `JWT_SECRET`: A secure random string
  - `NODE_ENV`: `production`
  - `FRONTEND_URL`: Your Vercel app URL (e.g., `https://your-app.vercel.app`)

## 🛠️ Scripts
- `npm run dev`: Start dev server with Nodemon.
- `npm run build`: Compile TypeScript to JavaScript.
- `npm run start`: Run the compiled production app.
- `npm run seed`: Populate the database with test data.

## 🔒 Security
- Rate limiting is enabled (100 requests per 15 minutes).
- CORS is restricted to the `FRONTEND_URL`.
- Inputs are validated via Zod middlewares.
