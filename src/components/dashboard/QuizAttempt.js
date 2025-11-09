import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import api from "../../utils/api";
import "./QuizAttempt.css";
import "../../App.css";

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [startTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    api
      .get(`/quizzes/${id}/questions`)
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, [id]);

  // Timer effect - update elapsed time every second
  useEffect(() => {
    if (submitted) return; // Stop timer when quiz is submitted

    // Initialize elapsed time immediately
    const initialElapsed = Math.floor((new Date() - startTime) / 1000);
    setElapsedTime(initialElapsed);

    const interval = setInterval(() => {
      const elapsed = Math.floor((new Date() - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, submitted]);

  // Prevent navigation during quiz
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!submitted) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [submitted]);

  const handleSelect = (qid, optionText) => {
    setAnswers((prev) => ({ ...prev, [qid]: optionText }));
  };

  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  }, [currentQuestion, questions.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }, [currentQuestion]);

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to submit the quiz? You cannot change your answers after submission.')) {
      // Calculate final time taken
      const finalTimeTaken = Math.max(elapsedTime, Math.floor((new Date() - startTime) / 1000));
      
      // Prepare answers array - include all questions, even if not answered
      const answersArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption: selectedOption || '', // Ensure selectedOption is always a string
      }));

      const payload = {
        quizId: id,
        answers: answersArray,
        timeTaken: finalTimeTaken,
        startTime: startTime.toISOString(),
      };

      try {
        const res = await api.post(`/quizzes/${id}/submit`, payload);
        setResult(res.data);
        setSubmitted(true);
      } catch (error) {
        console.error('Error submitting quiz:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
        alert(`Error submitting quiz: ${errorMessage}`);
      }
    }
  };

  // Format time in MM:SS or HH:MM:SS format
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReportQuestion = () => {
    setShowReportModal(true);
    setReportReason('');
    setReportMessage('');
  };

  const handleSubmitReport = async () => {
    if (!reportReason.trim()) {
      setReportMessage('Please provide a reason for reporting this question.');
      return;
    }

    setIsReporting(true);
    setReportMessage('');

    try {
      const response = await api.post('/reports', {
        questionId: questions[currentQuestion]._id,
        reason: reportReason.trim(),
      });

      if (response.status === 201) {
        setReportMessage('✅ Report submitted successfully!');
        setTimeout(() => {
          setShowReportModal(false);
          setReportReason('');
          setReportMessage('');
        }, 1500);
      }
    } catch (error) {
      console.error('Error reporting question:', error);
      if (error.response?.status === 400) {
        setReportMessage(error.response.data.message || 'You have already reported this question.');
      } else {
        setReportMessage('❌ Error submitting report. Please try again.');
      }
    } finally {
      setIsReporting(false);
    }
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setReportReason('');
    setReportMessage('');
  };

  // Keyboard shortcuts
  useHotkeys('n', handleNext, { enabled: !submitted && currentQuestion < questions.length - 1 });
  useHotkeys('p', handlePrevious, { enabled: !submitted && currentQuestion > 0 });
  useHotkeys('s', handleSubmit, { enabled: !submitted, preventDefault: true });

  // Number keys for selecting options (1-4)
  useHotkeys('1', () => {
    if (questions[currentQuestion] && questions[currentQuestion].options[0]) {
      handleSelect(questions[currentQuestion]._id, questions[currentQuestion].options[0].optionText);
    }
  }, { enabled: !submitted });
  useHotkeys('2', () => {
    if (questions[currentQuestion] && questions[currentQuestion].options[1]) {
      handleSelect(questions[currentQuestion]._id, questions[currentQuestion].options[1].optionText);
    }
  }, { enabled: !submitted });
  useHotkeys('3', () => {
    if (questions[currentQuestion] && questions[currentQuestion].options[2]) {
      handleSelect(questions[currentQuestion]._id, questions[currentQuestion].options[2].optionText);
    }
  }, { enabled: !submitted });
  useHotkeys('4', () => {
    if (questions[currentQuestion] && questions[currentQuestion].options[3]) {
      handleSelect(questions[currentQuestion]._id, questions[currentQuestion].options[3].optionText);
    }
  }, { enabled: !submitted });

  if (submitted && result) {
    return (
      <div className="quiz-result">
        <h2 className="result-title">Quiz Submitted!</h2>
        <p className="result-score">
          Your Score: <strong>{result.score}</strong> / {result.total} ({result.percentage}%)
        </p>
        {result.timeTaken && (
          <p className="result-time">Time Taken: {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s</p>
        )}
        {result.awardedBadges && result.awardedBadges.length > 0 && (
          <div className="badges-earned">
            <h3>Badges Earned!</h3>
            {result.awardedBadges.map((badge) => (
              <div key={badge._id} className="badge">
                <span>{badge.icon}</span> {badge.name}
              </div>
            ))}
          </div>
        )}
        <button className="btn" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="quiz-loading">Loading quiz...</div>;
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="quiz-attempt">
      <div className="quiz-header">
      <h2 className="quiz-title">Quiz</h2>
        <div className="quiz-header-right">
          <div className="quiz-timer">
            <span className="timer-icon">⏱️</span>
            <span className="timer-text">{formatTime(elapsedTime)}</span>
          </div>
          <div className="quiz-progress">
            Question {currentQuestion + 1} of {questions.length}
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="quiz-question">
        <div className="question-header">
          <h4 className="question-text">{currentQ.questionText}</h4>
          <button 
            className="report-question-btn"
            onClick={handleReportQuestion}
            title="Report this question"
          >
            ⚠️ Report Question
          </button>
        </div>
          <div className="options-group">
          {currentQ.options.map((opt, idx) => (
              <label className="option-item" key={idx}>
                <input
                  type="radio"
                name={currentQ._id}
                  value={opt.optionText}
                checked={answers[currentQ._id] === opt.optionText}
                onChange={() => handleSelect(currentQ._id, opt.optionText)}
                />
              <span className="option-number">{idx + 1}.</span>
                {opt.optionText}
              </label>
            ))}
          </div>
        </div>

      <div className="quiz-navigation">
        <button
          className="btn nav-btn"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous (P)
        </button>
        <button
          className="btn nav-btn"
          onClick={handleNext}
          disabled={currentQuestion === questions.length - 1}
        >
          Next (N)
        </button>
      <button className="btn submit-btn" onClick={handleSubmit}>
          Submit Quiz (S)
      </button>
      </div>

      <div className="keyboard-shortcuts">
        <p>Keyboard Shortcuts: N = Next, P = Previous, S = Submit, 1-4 = Select Option</p>
      </div>

      {showConfirm && (
        <div className="confirm-dialog">
          <p>Are you sure you want to leave? Your progress will be lost.</p>
          <button onClick={() => setShowConfirm(false)}>Stay</button>
          <button onClick={() => navigate('/dashboard')}>Leave</button>
        </div>
      )}

      {showReportModal && (
        <div className="report-modal-overlay" onClick={handleCloseReportModal}>
          <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="report-modal-header">
              <h3>Report Question</h3>
              <button className="close-modal-btn" onClick={handleCloseReportModal}>×</button>
            </div>
            <div className="report-modal-body">
              <p className="report-question-preview">
                <strong>Question:</strong> {currentQ.questionText}
              </p>
              <label htmlFor="report-reason">
                <strong>Reason for reporting:</strong>
              </label>
              <textarea
                id="report-reason"
                className="report-reason-input"
                placeholder="Please explain why you are reporting this question (e.g., inappropriate content, incorrect answer, offensive language, etc.)"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={5}
                disabled={isReporting}
              />
              {reportMessage && (
                <div className={`report-message ${reportMessage.includes('✅') ? 'success' : 'error'}`}>
                  {reportMessage}
                </div>
              )}
            </div>
            <div className="report-modal-footer">
              <button 
                className="btn cancel-btn" 
                onClick={handleCloseReportModal}
                disabled={isReporting}
              >
                Cancel
              </button>
              <button 
                className="btn submit-report-btn" 
                onClick={handleSubmitReport}
                disabled={isReporting || !reportReason.trim()}
              >
                {isReporting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizAttempt;
