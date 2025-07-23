import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import roleHoc from '../hoc/roleHoc';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";

const ExamCreate = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchExams = async () => {
    try {
      const response = await api.get('/exams/exams/');
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setExams(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.post('/exams/exams/', data);
      alert("Exam created successfully!");
      reset();

      try {
        await fetchExams(); 
      } catch (fetchErr) {
        console.error("Exam created but fetching failed", fetchErr);
        setError("Exam created, but failed to reload list");
      }

    } catch (error) {
      console.error("Error creating exam:", error.response?.data || error);
      setError("Failed to create exam");
    }
  };

  return (
    <Box maxWidth={600} mx="auto" p={2}>
      <Typography variant="h5" align="center" gutterBottom>
        Create Exam
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Title"
          fullWidth
          {...register("title", { required: "Title is required" })}
          error={!!errors.title}
          helperText={errors.title?.message}
          margin="normal"
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          {...register("description", { required: "Description is required" })}
          error={!!errors.description}
          helperText={errors.description?.message}
          margin="normal"
        />

        <Button type="submit" variant="contained" sx={{ backgroundColor: "#0f0f0f" }}>
          Create Exam
        </Button>
      </form>

      <Typography variant="h6" mt={4}>My Exams</Typography>
      {loading && <Typography>Loading exams...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && exams.length === 0 ? (
        <Typography>No exams found.</Typography>
      ) : (
        exams.map((exam) => (
          <Box key={exam.id} p={2} mb={2} border="1px solid #ccc" borderRadius={2}>
            <Typography variant="subtitle1"><strong>{exam.title}</strong></Typography>
            <Typography variant="body2">{exam.description}</Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
              onClick={() => navigate(`/dashboard/exams/${exam.id}/questions`)}
            >
              Add Questions
            </Button>
          </Box>
        ))
      )}
    </Box>
  );
};

const ProtectedExamCreate = roleHoc(ExamCreate, ['Teacher']);
export default ProtectedExamCreate;
