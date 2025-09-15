import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import LoginSignupForm from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";
import Quiz from "./components/Quizz";
import CertificatePage from './components/Certificate'
import ResultsPage from './components/ResultsPage'
import { Toaster } from "react-hot-toast";
import "./App.css";

function App() {
  const isLoggedIn = localStorage.getItem('Quizz-Pro')
  return (
    <>
    <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginSignupForm></LoginSignupForm>} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home></Home>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:categoryId"
            element={
              <ProtectedRoute>
                <Quiz></Quiz>
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificate/:resultId"
            element={
              <ProtectedRoute>
                <CertificatePage></CertificatePage>
              </ProtectedRoute>
            }
          />
          <Route path="/results" element={<ProtectedRoute><ResultsPage></ResultsPage></ProtectedRoute>} />
          <Route
            path="*"
            element={
              isLoggedIn ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
