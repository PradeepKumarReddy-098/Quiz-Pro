import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../Loader';
import Navbar from '../Navbar';
import './index.css'

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(results)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('Quizz-Pro');
        const res = await fetch('http://localhost:3001/api/quiz/my-results', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setResults(data.results);
        } else {
          setError(data.message || 'Failed to fetch results');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  if (results.length === 0) return <p>No quiz history found.</p>;

  return (
    <>
    <Navbar></Navbar>
    <div style={{ maxWidth: 800, margin: 'auto' }}>
      <h2>Your Quiz History</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #1976d2' }}>
            <th style={{ padding: '8px' }}>Quiz</th>
            <th style={{ padding: '8px' }}>Score (%)</th>
            <th style={{ padding: '8px' }}>Passed</th>
            <th style={{ padding: '8px' }}>Date</th>
            <th style={{ padding: '8px' }}>Certificate</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}>{result.quizId?.name || 'N/A'}</td>
              <td style={{ padding: '8px' }}>{result.score}</td>
              <td style={{ padding: '8px' }}>{result.passed ? 'Yes' : 'No'}</td>
              <td style={{ padding: '8px' }}>{new Date(result.date).toLocaleDateString()}</td>
              <td style={{ padding: '8px' }}>
                {result.passed ? (
                  <button
                    onClick={()=>navigate(`/certificate/${result._id}`)}
                    className='view-certificate-btn'
                  >
                    View Certificate
                  </button>
                ) : (
                  '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default ResultsPage;
