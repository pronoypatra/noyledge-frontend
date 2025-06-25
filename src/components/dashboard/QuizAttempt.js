import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";

const QuizAttempt = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // useEffect(() => {
  //   api.get(`/quizzes/${id}/questions`).then((res) => setQuestions(res.data));
  // }, [id]);
  useEffect(() => {
    console.log("📤 Sending request to get questions for quiz:", id);
    api
      .get(`/quizzes/${id}/questions`)
      .then((res) => {
        setQuestions(res.data);
      })
      .catch((err) => {
        console.error("❌ Error fetching questions:", err);
      });
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
      <div>
        <h2>Quiz Submitted!</h2>
        <p>
          Your Score: {result.score} / {result.total}
        </p>
      </div>
    );

  return (
    <div>
      <h2>Quiz</h2>
      {questions.map((q) => (
        <div key={q._id}>
          <h4>{q.questionText}</h4>
          {q.options.map((opt, idx) => (
            <div key={idx}>
              <label>
                <input
                  type="radio"
                  name={q._id}
                  value={opt.optionText}
                  checked={answers[q._id] === opt.optionText}
                  onChange={() => handleSelect(q._id, opt.optionText)}
                />
                {opt.optionText}
              </label>
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Quiz</button>
    </div>
  );
};

export default QuizAttempt;
