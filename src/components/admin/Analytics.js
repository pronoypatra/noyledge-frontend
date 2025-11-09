import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../utils/api';
import './Analytics.css';

const Analytics = () => {
  const { quizId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [participantGrowth, setParticipantGrowth] = useState([]);
  const [attemptsOverTime, setAttemptsOverTime] = useState([]);
  const [scoreTrends, setScoreTrends] = useState([]);
  const [completionTimeData, setCompletionTimeData] = useState({ histogram: [], stats: {} });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const [analyticsRes, participantsRes, attemptsRes, scoresRes, completionTimeRes] = await Promise.all([
        api.get(`/analytics/quiz/${quizId}`),
        api.get(`/analytics/quiz/${quizId}/participants`),
        api.get(`/analytics/quiz/${quizId}/attempts`),
        api.get(`/analytics/quiz/${quizId}/scores`),
        api.get(`/analytics/quiz/${quizId}/completion-time`),
      ]);

      setAnalytics(analyticsRes.data);
      setParticipantGrowth(participantsRes.data);
      setAttemptsOverTime(attemptsRes.data);
      setScoreTrends(scoresRes.data);
      setCompletionTimeData(completionTimeRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Format time in MM:SS or HH:MM:SS format
  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return '0s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    } else if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  if (loading) {
    return <div className="analytics-loading">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="analytics-error">Analytics not found</div>;
  }

  return (
    <div className="analytics-container">
      <h1>Quiz Analytics: {analytics.quiz.title}</h1>

      <div className="analytics-stats">
        <div className="stat-card">
          <h3>{analytics.stats.totalParticipants}</h3>
          <p>Total Participants</p>
        </div>
        <div className="stat-card">
          <h3>{analytics.stats.totalAttempts}</h3>
          <p>Total Attempts</p>
        </div>
        <div className="stat-card">
          <h3>{analytics.stats.averageScore}%</h3>
          <p>Average Score</p>
        </div>
        <div className="stat-card">
          <h3>{formatTime(completionTimeData.stats.averageTime || 0)}</h3>
          <p>Average Completion Time</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>Participant Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={participantGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="participants" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Attempts Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attemptsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="attempts" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Average Score Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scoreTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="averageScore" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Completion Time Distribution</h2>
          {completionTimeData.stats.totalAttempts > 0 ? (
            <>
              <div className="completion-time-stats">
                <div className="time-stat">
                  <span className="time-stat-label">Average:</span>
                  <span className="time-stat-value">{formatTime(completionTimeData.stats.averageTime)}</span>
                </div>
                <div className="time-stat">
                  <span className="time-stat-label">Median:</span>
                  <span className="time-stat-value">{formatTime(completionTimeData.stats.medianTime)}</span>
                </div>
                <div className="time-stat">
                  <span className="time-stat-label">Min:</span>
                  <span className="time-stat-value">{formatTime(completionTimeData.stats.minTime)}</span>
                </div>
                <div className="time-stat">
                  <span className="time-stat-label">Max:</span>
                  <span className="time-stat-value">{formatTime(completionTimeData.stats.maxTime)}</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={completionTimeData.histogram}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="range" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Number of Attempts" />
                </BarChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div className="no-data-message">No completion time data available yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

