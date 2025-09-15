import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ErrorPage, Loader } from "../Loader";
import Navbar from "../Navbar";
import "./index.css";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const jwtToken = localStorage.getItem("Quizz-Pro");
        setIsLoading(true);
        const request = await fetch(
          "http://localhost:3001/api/quiz/categories",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const response = await request.json();
        if (request.ok) {
          const data = response.categories;
          setCategories(data);
        } else {
          toast.error(response.message);
          setError(true)
        }
      } catch (error) {
        console.log(error.message);
        setError(true)
        toast.error("Internal Error");
      } finally {
        setIsLoading(false);
      }
    };
    getCategories();
  }, []);

  const handleCategoryClick = (id) => {
    navigate(`/quiz/${id}`);
  };
  if (isLoading) {
    return (
      <Loader />
    );
  }

  if(error){
    return <ErrorPage />
  }
  return (
    <>
    <Navbar></Navbar>
      <div className="home-container">
        <section className="banner">
          <h1>Welcome to AGH LMS Micro-Certification</h1>
          <p>Attempt quizzes, earn certificates, and boost your skills!</p>
        </section>
        <h2>Select Quiz Category</h2>
        <div className="category-list">
          {categories.map((category) => (
            <button
              className="category-btn"
              key={category._id}
              onClick={() => handleCategoryClick(category._id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <section className="instructions">
          <h3>How it works:</h3>
          <ul>
            <li>Select a quiz category Above</li>
            <li>Answer the questions</li>
            <li>Get instant results and download your certificate</li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default Home;
