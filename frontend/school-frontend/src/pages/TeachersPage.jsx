import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const { register, handleSubmit, reset, watch } = useForm();
  const fetchTeachers = async (url = '/teachers/') => {
    try {
      const res = await api.get(url);
      setTeachers(res.data.results || res.data); 
      setNextPage(res.data.next?.replace(api.defaults.baseURL, '') || null);
      setPrevPage(res.data.previous?.replace(api.defaults.baseURL, '') || null);
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

  const onSubmit = async (data) => {
    try {
      await api.post('/teachers/', data);
      reset();
      setShowForm(false);
      setError('');
      fetchTeachers();
    } catch (err) {
        const errorData = err.response?.data;
        const firstError = typeof errorData === 'object' ? Object.values(errorData)[0] : err.message;
        setError(firstError || 'Failed to add teacher');
    }

  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Teachers List</h2>

      <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: '1rem' }}>
        {showForm ? 'Cancel' : 'Add Teacher'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: '2rem' }}>
          <input {...register('username')} placeholder="Username" required />
          <input {...register('first_name')} placeholder="First Name" required />
          <input {...register('last_name')} placeholder="Last Name" required />
          <input {...register('email')} type="email" placeholder="Email" required />
          <input {...register('phone_number')} placeholder="Phone Number" required />
          <input {...register('employee_id')} placeholder="Employee ID" required />
          <input {...register('subject_specialization')} placeholder="Subject Specialization" required />

          <div style={{ marginBottom: '1rem' }}>
            <label>Date of Joining</label><br />
            <input {...register('date_of_joining')} type="date" required />
          </div>

          <select {...register('status')} required>
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <input {...register('password')} type="password" placeholder="Password" required />
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
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => fetchTeachers(prevPage)} disabled={!prevPage}style={{ marginRight: '1rem' }}>
          Previou</button>
        <button onClick={() => fetchTeachers(nextPage)} disabled={!nextPage}>
          Next</button>
      </div>


      {selectedTeacher && (
        <div style={{ marginTop: '2rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
          <h3>Teacher Details</h3>
          <p><strong>ID:</strong> {selectedTeacher.id}</p>
          <p><strong>Name:</strong> {selectedTeacher.first_name} {selectedTeacher.last_name}</p>
          <p><strong>Email:</strong> {selectedTeacher.email}</p>
          <p><strong>Phone:</strong> {selectedTeacher.phone_number}</p>
          <p><strong>Subject:</strong> {selectedTeacher.subject_specialization}</p>
          <p><strong>Employee ID:</strong> {selectedTeacher.employee_id}</p>
          <p><strong>Date of Joining:</strong> {selectedTeacher.date_of_joining}</p>
          <p><strong>Status:</strong> {selectedTeacher.status}</p>
        </div>
      )}
    </div>
  );
};

export default TeachersPage;
