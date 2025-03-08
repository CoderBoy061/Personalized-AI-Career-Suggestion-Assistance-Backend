# **📌 Personalized AI Career Suggestion Assistance**
🚀 A full-stack AI-powered career planning application built with **Node.js, MongoDB, Docker, Redis, and OpenAI**. Users can log in via **Google OAuth (Passport.js) and JWT authentication**, upload their **profile & education background**, and receive **personalized career path recommendations**. Users can **track their progress** and follow a guided learning roadmap.

---

## **🛠 Tech Stack**
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Redis, OpenAI API
- **Authentication:** Google OAuth (Passport.js), JWT Authentication
- **Caching:** Redis
- **Containerization:** Docker
- **Frontend:** React (Vite), Redux, Tailwind CSS, ShadCN/UI
- **Others:** Middleware (Protected Routes), Progress Tracking

---

## **🚀 Features**
✅ **Google Login** (OAuth with Passport.js)  
✅ **JWT Authentication** (Session Management)  
✅ **User Profile & Education Background** Upload  
✅ **AI Career Path Generation** (OpenAI API)  
✅ **Guided Learning Roadmap** (Step-by-Step Chapters)  
✅ **Progress Tracking** (Mark Chapters as Complete)  
✅ **Caching with Redis** (Performance Optimization)  
✅ **Dockerized Setup** (MongoDB, Redis, Backend, Frontend)  

---

## **🛠 Setup & Installation**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/CoderBoy061/Personalized-AI-Career-Suggestion-Assistance-Backend.git
cd Personalized-AI-Career-Suggestion-Assistance-Backend
```

---

## **2️⃣ Backend Setup**
### **📌 Install Dependencies**
```sh
npm install
```

### **📌 Setup Environment Variables (`.env`)**
Create a `.env` file in the root and add:
```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/career-planner
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
REDIS_HOST=localhost
REDIS_PORT=6379
```

### **📌 Start Backend Server**
```sh
npm run dev
```
By default, the backend runs on **`http://localhost:5000`**.

---

## **3️⃣ Frontend Setup**
### **📌 Move to Frontend Directory**
```sh
cd frontend
```

### **📌 Install Dependencies**
```sh
npm install
```

### **📌 Start Frontend Server**
```sh
npm run dev
```
By default, the frontend runs on **`http://localhost:5173`**.

---

## **4️⃣ Docker Setup**
### **📌 Build & Run Containers**
```sh
docker-compose up --build
```
This will start:
- **MongoDB** (Database)
- **Redis** (Caching)
- **Backend** (Node.js API)
- **Frontend** (React Vite)

### **📌 Stop Containers**
```sh
docker-compose down
```

---

## **5️⃣ Database Setup (MongoDB)**
### **📌 Run MongoDB Locally**
```sh
docker run -d -p 27017:27017 --name career-planner-mongo mongo
```

### **📌 Check MongoDB Connection**
```sh
mongo
use career-planner
```

---

## **6️⃣ Redis Setup**
### **📌 Run Redis Locally**
```sh
docker run -d -p 6379:6379 --name career-planner-redis redis
```

### **📌 Test Redis Connection**
```sh
redis-cli
ping
```
If Redis is running, it should return **PONG**.


## **🔒 Protected Routes (Middleware)**
- **`isAuthenticated` Middleware**: Ensures users can access only after authentication.
- **`cacheMiddleware` (Redis)**: Speeds up responses for AI-generated career paths.

## **🛠 Contributing**
👨‍💻 Contributions are welcome!  
To contribute, fork the repository and create a pull request with your changes.

---

## **📜 License**
This project is licensed under the **MIT License**.

---

