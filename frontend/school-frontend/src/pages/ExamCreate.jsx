import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const ExamCreate = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api.get('/exams/');
        setExams(response.data);
      } catch (err) {
        setError('Failed to fetch exams');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return (
    <div>
        <h2>Create Exam</h2>

        <input type="text" placeholder="Title" />
    
        <h2>My Exams</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul>
        {exams.map((exam) => (
            <li key={exam.id}>
            <strong>{exam.title}</strong><br />
            <small>{exam.description}</small>
            </li>
        ))}
        </ul>
    </div>
    );

};

export default ExamCreate;
