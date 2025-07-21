import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    employee_id: '',
    subject_specialization: '',
    date_of_joining: '',
    status: '',
    password: ''
  });

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/teachers/');
      setTeachers(res.data.results || res.data); // depends on pagination
    } catch (err) {
      console.error(err);
      setError('Failed to load teachers');
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleClick = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/teachers/', formData);
      setShowForm(false);
      fetchTeachers(); 
    } catch (err) {
      console.error(err.response?.data);
      setError('Failed to add teacher');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Teachers List</h2>
      <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: '1rem' }}>
        {showForm ? 'Cancel' : 'Add Teacher'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          {[
            "username", "first_name", "last_name", "email", "phone_number",
            "employee_id", "subject_specialization", "date_of_joining", "status", "password"
          ].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.replace(/_/g, ' ')}
              type={field === 'password' ? 'password' : 'text'}
              onChange={handleChange}
              required
            />
          ))}
          <button type="submit">Submit</button>
        </form>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {teachers.map((teacher) => (
          <li
            key={teacher.id}
            style={{
              marginBottom: '10px',
              cursor: 'pointer',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
            onClick={() => handleClick(teacher)}
          >
            <strong>{teacher.first_name} {teacher.last_name}</strong> - {teacher.employee_id}
          </li>
        ))}
      </ul>

      {selectedTeacher && (
        <div style={{ marginTop: '2rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
          <h3>Teacher Details</h3>
          <p><strong>Name:</strong> {selectedTeacher.first_name} {selectedTeacher.last_name}</p>
          <p><strong>Email:</strong> {selectedTeacher.email}</p>
          <p><strong>Phone:</strong> {selectedTeacher.phone_number}</p>
          <p><strong>Subject:</strong> {selectedTeacher.subject_specialization}</p>
          <p><strong>Date of Joining:</strong> {selectedTeacher.date_of_joining}</p>
          <p><strong>Status:</strong> {selectedTeacher.status}</p>
        </div>
      )}
    </div>
  );
};

export default TeachersPage;
