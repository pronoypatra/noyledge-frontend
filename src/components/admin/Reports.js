import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import Navbar from '../common/Navbar';
import './Reports.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editForm, setEditForm] = useState({ questionText: '', options: [] });

  const fetchReports = useCallback(async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await api.get('/reports', { params });
      setReports(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleFix = async (reportId) => {
    try {
      await api.put(`/reports/${reportId}/fix`, editForm);
      setEditingQuestion(null);
      fetchReports();
      alert('Question fixed successfully');
    } catch (error) {
      console.error('Error fixing question:', error);
      alert('Error fixing question');
    }
  };

  const handleIgnore = async (reportId) => {
    try {
      await api.put(`/reports/${reportId}/ignore`);
      fetchReports();
    } catch (error) {
      console.error('Error ignoring report:', error);
    }
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await api.delete(`/reports/${reportId}`);
        fetchReports();
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };

  const startEditing = (report) => {
    setEditingQuestion(report._id);
    setEditForm({
      questionText: report.questionId?.questionText || '',
      options: report.questionId?.options || [],
    });
  };

  if (loading) {
    return <div className="reports-loading">Loading reports...</div>;
  }

  return (
    <div className="reports-container">
      <Navbar />
      <div className="reports-content">
        <h1>Question Reports</h1>

      <div className="reports-filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={filter === 'fixed' ? 'active' : ''}
          onClick={() => setFilter('fixed')}
        >
          Fixed
        </button>
        <button
          className={filter === 'ignored' ? 'active' : ''}
          onClick={() => setFilter('ignored')}
        >
          Ignored
        </button>
      </div>

      <div className="reports-list">
        {reports.map((report) => (
          <div key={report._id} className="report-item">
            <div className="report-header">
              <h3>Report #{report._id.slice(-6)}</h3>
              <span className={`status-badge ${report.status}`}>{report.status}</span>
            </div>

            <div className="report-details">
              {report.questionId?.quiz && (
                <p><strong>Quiz:</strong> {report.questionId.quiz.title}</p>
              )}
              <p><strong>Reason:</strong> {report.reason}</p>
              <p><strong>Reported by:</strong> {report.reportedBy?.name}</p>
              <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleString()}</p>
              {report.expiresAt && (
                <p className={new Date(report.expiresAt) < new Date() ? 'expired' : ''}>
                  <strong>Expires:</strong> {new Date(report.expiresAt).toLocaleString()}
                </p>
              )}
            </div>

            <div className="question-preview">
              <h4>Question:</h4>
              <p>{report.questionId?.questionText}</p>
              {report.questionId?.options && (
                <ul>
                  {report.questionId.options.map((opt, idx) => (
                    <li key={idx} className={opt.isCorrect ? 'correct' : ''}>
                      {opt.optionText}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {editingQuestion === report._id ? (
              <div className="edit-form">
                <textarea
                  value={editForm.questionText}
                  onChange={(e) => setEditForm({ ...editForm, questionText: e.target.value })}
                  placeholder="Question text"
                />
                {editForm.options.map((opt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={opt.optionText}
                    onChange={(e) => {
                      const newOptions = [...editForm.options];
                      newOptions[idx].optionText = e.target.value;
                      setEditForm({ ...editForm, options: newOptions });
                    }}
                    placeholder={`Option ${idx + 1}`}
                  />
                ))}
                <div className="form-actions">
                  <button onClick={() => handleFix(report._id)}>Save Fix</button>
                  <button onClick={() => setEditingQuestion(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="report-actions">
                {report.status === 'pending' && (
                  <>
                    <button onClick={() => startEditing(report)}>Fix</button>
                    <button onClick={() => handleIgnore(report._id)}>Ignore</button>
                    <button onClick={() => handleDelete(report._id)} className="delete-btn">
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="no-reports">No reports found</div>
      )}
      </div>
    </div>
  );
};

export default Reports;

