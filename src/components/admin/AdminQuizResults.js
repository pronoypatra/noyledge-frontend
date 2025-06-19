import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AdminQuizResults = () => {
  const { id: quizId } = useParams();
  const [results, setResults] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`/api/quizzes/${quizId}/results`);
        setResults(res.data.results);
        setQuizTitle(res.data.title);
      } catch (err) {
        console.error('Error fetching results:', err);
      }
    };

    fetchResults();
  }, [quizId]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Results for Quiz: {quizTitle}</h2>
      {results.length === 0 ? (
        <p>No results found for this quiz.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">User</th>
              <th className="p-2 border">Score</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Attempted On</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res, index) => (
              <tr key={index}>
                <td className="p-2 border">{res.username}</td>
                <td className="p-2 border">{res.score}</td>
                <td className="p-2 border">{res.total}</td>
                <td className="p-2 border">{new Date(res.attemptedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminQuizResults;
