import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Box, Typography, TextField, Button } from "@mui/material";
import api from "../api/axios";
import roleHoc from "../hoc/roleHoc";

const AddQuestion = () => {
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/exams/questions/?exam=${examId}`);
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setQuestions(data);
      } catch (err) {
        setError("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [examId]);

  const onSubmit = async (data) => {
    try {
      await api.post('/exams/questions/', {
        exam: examId,
        ...data
      });
      reset();
      const res = await api.get(`/exams/questions/?exam=${examId}`);
      const updated = Array.isArray(res.data) ? res.data : res.data.results || [];
      setQuestions(updated);
    } catch (err) {
      setError("Failed to add question");
    }
  };

  return (
    <Box maxWidth={800} mx="auto" p={2}>
      <Typography variant="h5" gutterBottom>
        Questions for Exam #{examId}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Question Text"
          fullWidth
          {...register("text", { required: "Question text is required" })}
          error={!!errors.text}
          helperText={errors.text?.message}
          margin="normal"
        />

        {["a", "b", "c", "d"].map((opt) => (
          <TextField
            key={opt}
            label={`Option ${opt.toUpperCase()}`}
            fullWidth
            {...register(`option_${opt}`, { required: `Option ${opt.toUpperCase()} is required` })}
            error={!!errors[`option_${opt}`]}
            helperText={errors[`option_${opt}`]?.message}
            margin="normal"
          />
        ))}

        <TextField
          select
          fullWidth
          defaultValue=""
          label="correct answer"
          {...register("correct_answer", { required: "Correct answer is required" })}
          SelectProps={{ native: true }}
          error={!!errors.correct_answer}
          helperText={errors.correct_answer?.message}
          margin="normal"
        >
          <option value=""> </option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </TextField>

        <Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor:"#0f0f0f"}}>
          Add Question
        </Button>
      </form>

      <Typography variant="h6" mt={4}>Existing Questions</Typography>
      {loading && <Typography>Loading…</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && questions.length === 0 && (
        <Typography>No questions added yet.</Typography>
      )}

      {questions.map((q) => (
        <Box key={q.id} mt={2} p={2} border="1px solid #ccc" borderRadius={2}>
          <Typography><strong>{q.text}</strong></Typography>
          <Typography>A. {q.option_a}</Typography>
          <Typography>B. {q.option_b}</Typography>
          <Typography>C. {q.option_c}</Typography>
          <Typography>D. {q.option_d}</Typography>
          <Typography sx={{ mt: 1 }}>Correct Answer: {q.correct_answer}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default roleHoc(AddQuestion, ["Teacher"]);
