import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import "./QuizAttempt.css";
import "../../App.css";

const QuizAttempt = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api
      .get(`/quizzes/${id}/questions`)
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, [id]);

  const handleSelect = (qid, optionText) => {
    setAnswers((prev) => ({ ...prev, [qid]: optionText }));
  };

  const handleSubmit = async () => {
    const payload = {
      quizId: id,
      answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      })),
    };

    const res = await api.post(`/quizzes/${id}/submit`, payload);
    setResult(res.data);
    setSubmitted(true);
  };

  if (submitted)
    return (
      <div className="quiz-result">
        <h2 className="result-title">Quiz Submitted!</h2>
        <p className="result-score">
          Your Score: <strong>{result.score}</strong> / {result.total}
        </p>
      </div>
    );

  return (
    <div className="quiz-attempt">
      <h2 className="quiz-title">Quiz</h2>
      {questions.map((q) => (
        <div className="quiz-question" key={q._id}>
          <h4 className="question-text">{q.questionText}</h4>
          <div className="options-group">
            {q.options.map((opt, idx) => (
              <label className="option-item" key={idx}>
                <input
                  type="radio"
                  name={q._id}
                  value={opt.optionText}
                  checked={answers[q._id] === opt.optionText}
                  onChange={() => handleSelect(q._id, opt.optionText)}
                />
                {opt.optionText}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button className="btn submit-btn" onClick={handleSubmit}>
        Submit Quiz
      </button>
    </div>
  );
};

export default QuizAttempt;
