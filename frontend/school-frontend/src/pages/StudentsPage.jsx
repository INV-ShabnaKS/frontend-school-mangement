import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios'; 
import CSVImport from '../components/csv';





const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState('');
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentUrl, setCurrentUrl] = useState('/students/');
  const [showAddForm, setShowAddForm] = useState(false);

  const { register, handleSubmit, reset } = useForm();
  


  const fetchStudents = async (url) => {
    try {
      const res = await api.get(url);
      setStudents(res.data.results);
      setNextPage(res.data.next?.replace(api.defaults.baseURL, '') || null);
      setPrevPage(res.data.previous?.replace(api.defaults.baseURL, '') || null);
    } catch (err) {
      console.error(err);
      setError('Failed to load students');
    }
  };

  useEffect(() => {
    fetchStudents(currentUrl);
  }, [currentUrl]);

  const handleClick = (student) => {
    setSelectedStudent(student);
  };

  const goToNextPage = () => {
    if (nextPage) setCurrentUrl(nextPage);
  };

  const goToPrevPage = () => {
    if (prevPage) setCurrentUrl(prevPage);
  };

  const onSubmit = async (data) => {
    try {
      await api.post('/students/', data);
      reset();
      setShowAddForm(false);
      fetchStudents(currentUrl);
    } catch (err) {
      console.error('Add student failed:', err.response?.data || err.message);

    }
  };



  return (
    <div style={{ padding: '2rem' }}>
      <h2>Students List</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={() => setShowAddForm(!showAddForm)} style={{ marginBottom: '1rem' }}>
        {showAddForm ? 'Cancel' : 'Add Student'}
      </button>
      <CSVImport onUpload={() => {setCurrentUrl('/students/');
        fetchStudents('/students/');}} />


    


      {showAddForm && (
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: '2rem' }}>
          <input {...register('username')} placeholder="Username" required />
          <input {...register('first_name')} placeholder="First Name" required />
          <input {...register('last_name')} placeholder="Last Name" required />
          <input {...register('email')} type="email" placeholder="Email" required />
          <input {...register('phone_number')} placeholder="Phone Number" required />
          <input {...register('roll_number')} placeholder="Roll Number" required />
          <input {...register('student_class')} placeholder="Class (e.g. 8A)" required />
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="dob">Date of Birth</label><br />
            <input id="dob"{...register('date_of_birth')}type="date" required/>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Admission Date</label><br />
            <input id="admission" {...register('admission_date')} type="date" required/>
          </div>

          <select {...register('status')} required>
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <input {...register('assigned_teacher')} type="number" placeholder="Assigned Teacher ID" required />
          <input {...register('password')} type="password" placeholder="Password" required />
          <button type="submit">Add</button>
        </form>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {students.map((student) => (
          <li
            key={student.id}
            style={{
              marginBottom: '10px',
              cursor: 'pointer',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
            onClick={() => handleClick(student)}
          >
            <strong>{student.first_name} {student.last_name}</strong> - {student.roll_number}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={goToPrevPage} disabled={!prevPage}>
          Previous
        </button>
        <button onClick={goToNextPage} disabled={!nextPage} style={{ marginLeft: '1rem' }}>
          Next
        </button>
      </div>

      {selectedStudent && (
        <div style={{ marginTop: '2rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
          <h3>Student Details</h3>
          <p><strong>Name:</strong> {selectedStudent.first_name} {selectedStudent.last_name}</p>
          <p><strong>Email:</strong> {selectedStudent.email}</p>
          <p><strong>Phone:</strong> {selectedStudent.phone_number}</p>
          <p><strong>Class:</strong> {selectedStudent.student_class}</p>
          <p><strong>Status:</strong> {selectedStudent.status}</p>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
