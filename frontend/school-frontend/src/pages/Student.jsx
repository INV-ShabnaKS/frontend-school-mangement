import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Grid, Paper } from '@mui/material';

const Student = () => {
  const { auth } = useAuth();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get('/students/');
        const results = response.data.results;

        if (auth?.role === 'Student' && results.length > 0) {
          setStudent(results[0]);
        } else {
          setError("Not authorized or no student data found.");
        }
      } catch (err) {
        setError('Failed to load student data');
      }
    };

    if (auth?.role === 'Student') {
      fetchStudent();
    }
  }, [auth]);

  if (!auth || auth.role !== 'Student') {
    return <Typography>You are not authorized to view this page.</Typography>;
  }

  if (error) return <Typography color="error">{error}</Typography>;
  if (!student) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" gutterBottom align="center">
        My Details
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography><strong>ID:</strong> {student.id}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Name:</strong> {student.first_name} {student.last_name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Phone:</strong> {student.phone_number}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Roll Number:</strong> {student.roll_number}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Class:</strong> {student.student_class}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Date of Birth:</strong> {student.date_of_birth}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Admission Date:</strong> {student.admission_date}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Status:</strong> {student.status}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Assigned Teacher ID:</strong> {student.assigned_teacher}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Student;
