import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import './AdminQuizResults.css';
import "../../App.css";

const AdminQuizResults = () => {
  const { id: quizId } = useParams();
  const [results, setResults] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get(`/quizzes/${quizId}/results`);
        setResults(res.data.results);
        setQuizTitle(res.data.title);
      } catch (err) {
        console.error('Error fetching results:', err);
      }
    };

    fetchResults();
  }, [quizId]);

  return (
    <div className="admin-results">
      <h2 className="results-title">Results for Quiz: {quizTitle}</h2>
      {results.length === 0 ? (
        <p className="info-message">No results found for this quiz.</p>
      ) : (
        <div className="table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Score</th>
                <th>Total</th>
                <th>Attempted On</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, index) => (
                <tr key={index}>
                  <td>{res.username}</td>
                  <td>{res.score}</td>
                  <td>{res.total}</td>
                  <td>{new Date(res.attemptedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminQuizResults;
