import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import {toast} from 'react-hot-toast'
import {Loader,ErrorPage} from '../Loader'
import Navbar from "../Navbar";
import './index.css';

const Quiz = () => {
  const { categoryId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState(false)
  const navgitave = useNavigate()


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://quiz-pro-backend-2.onrender.com/api/quiz/questions/${categoryId}`);
        const data = await response.json();
        if (response.ok){ setQuestions(data.questions);}
        else{
            setError(true)
        }
      } catch (err) {
        setError(true)
        console.error(err.message);
      }finally{
        setLoading(false)
      }
    };
    fetchQuestions();
  }, [categoryId]);

  const handleGenerateCertificate = () => {
    navgitave(`/certificate/${result.resultId}`)
  }

  const handleOptionClick = (selectedOption) => {
    const newAnswers = [...answers];
    newAnswers[current] = {
      questionId: questions[current]._id,
      selectedOption
    };
    setAnswers(newAnswers);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      submitAnswers(newAnswers);
    }
  };

  const submitAnswers = async (userAnswers) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('Quizz-Pro'); 
      const response = await fetch('https://quiz-pro-backend-2.onrender.com/api/quiz/submit-quiz', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quizId: categoryId,
          answers: userAnswers
        })
      });
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        alert(data.message || 'Failed to submit quiz');
        toast.error('Failed to submit quiz')
        
      }
    } catch (error) {
      alert('Network error');
      toast.error('Failed to submit quiz')
    }finally{
        setLoading(false);
    }
  };

  if(error){
    return (
        <ErrorPage></ErrorPage>
    )
  }

  if (loading) return <Loader />;

  if (result) {
    return (
        <>
        <Navbar></Navbar>
      <div className="quiz-result">
        <h2>Quiz Completed</h2>
        <p>Total Questions: {result.totalQuestions}</p>
        <p>Correct Answers: {result.correctCount}</p>
        <p>Your Score: {result.score}%</p>
        <p>{result.passed ? "You passed!" : "You failed."}</p>
        <button type="button" onClick={handleGenerateCertificate} className="generate-certificate-btn">Generate Certificate</button>
      </div>
      </>
    );
  }

  if (questions.length === 0) return <div className="loading">Loading Questions...</div>;

  const question = questions[current];

  return (
    <><Navbar></Navbar>
    <div className="quiz-container">
      <h3>Question {current + 1} of {questions.length}</h3>
      <p className="question-text">{question.questionText}</p>
      <div className="options-container">
        {question.options.map((opt, i) => (
          <button key={i} className="option-btn" onClick={() => handleOptionClick(opt)}>
            {opt}
          </button>
        ))}
      </div>
      <section className="quiz-note">
    <h4>Note:</h4>
    <p>Select an option it will directly move to the next question.</p>
    <p>You can't revisit the question. So think before answer.</p>
  </section>
    </div>
    </>
  );
};

export default Quiz;
