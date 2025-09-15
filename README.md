# Quiz Pro - Online Quiz Application

A full-stack online quiz application where users can register, take quizzes by category, view their results, and download/share certificates upon successful completion. The app features secure JWT-based authentication, personalized PDF certificate generation, and responsive UI built with React.

---

## Live Demo 

Check out the live deployed app on Vercel:   
https://quiz-pro-ecru.vercel.app/

---

## Features

- User registration and login with JWT authentication  
- Browse quizzes by categories  
- Take quizzes with instant navigation and answer submission  
- Prevent revisiting answered questions  
- Automatic scoring and pass/fail determination  
- View quiz history and detailed results  
- Generate and download personalized PDF certificates  
- Share certificates via native sharing options  
- User-friendly and responsive UI  
- Secure backend API with protected routes

---

## Tech Stack

- **Frontend:** React, React Router, react-hot-toast  
- **Backend:** Node.js, Express, MongoDB, Mongoose  
- **Authentication:** JWT  
- **PDF Certificate Generation:** PDFKit  
- **Deployment:** Vercel (Frontend), Node.js compatible server (Backend)

---

## Getting Started

### Prerequisites

- Node.js (v14+) and npm installed  
- MongoDB instance (local or cloud)  
- Optional: Vercel account for deployment

### Installation

1. Clone the repository:
https://github.com/PradeepKumarReddy-098/Quiz-Pro

2. Install backend dependencies:

      cd server

      npm install 


3. Install frontend dependencies:

      cd client

      npm install


### Environment Variables

Create a `.env` file in the root folder with the following:

- PORT=3001

- MONGO_URI=your_mongodb_connection_string

- JWT_SECRET=your_jwt_secret_key

- CLIENT_URL=http://localhost:5173

- SERVER_URL=http://localhost:3001


---

## API Endpoints (Summary)

- `POST /api/auth/login` - Login user  
- `POST /api/auth/register` - Register user  
- `GET /api/quiz/:categoryId` - Fetch quiz questions  
- `POST /api/quiz/submit-quiz` - Submit quiz answers  
- `GET /api/quiz/my-results` - Get user quiz history  
- `GET /api/certificate/:resultId` - Generate and stream PDF certificate

---

## Contributing

Contributions, issues and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/your-username/quiz-pro/issues).





