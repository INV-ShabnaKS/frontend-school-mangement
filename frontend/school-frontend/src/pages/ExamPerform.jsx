import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button
} from "@mui/material";
import api from "../api/axios";
import roleHoc from "../hoc/roleHoc";

const ExamPerform = () => {
  const { examId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [timer, setTimer] = useState(300);
  const [loading, setLoading] = useState(true);

  // Load exam on mount
  useEffect(() => {
    const init = async () => {
      try {
        const scoreRes = await api.get(`/student-score?exam_id=${examId}`);
        const questionsRes = await api.get(`/exams/questions/?exam=${examId}`);
        const qdata = Array.isArray(questionsRes.data)
          ? questionsRes.data
          : questionsRes.data.results || [];

        setScore(scoreRes.data);
        setQuestions(qdata);
        setSubmitted(true);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404) {
          // Not submitted → start the exam
          try {
            await api.post(`/exams/start/${examId}/`);
            const questionsRes = await api.get(`/exams/questions/?exam=${examId}`);
            const qdata = Array.isArray(questionsRes.data)
              ? questionsRes.data
              : questionsRes.data.results || [];

            setQuestions(qdata);
            setSubmitted(false);
            setLoading(false);
          } catch (startErr) {
            console.error("Failed to start exam:", startErr);
            setLoading(false);
          }
        } else {
          console.error("Unexpected error:", err);
          setLoading(false);
        }
      }
    };

    init();
  }, [examId]);

  // Timer logic
  useEffect(() => {
    if (submitted) return;

    if (timer <= 0) {
      handleSubmit(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, submitted]);

  // Select option
  const handleOptionSelect = (qid, val) => {
    const updated = { ...answers, [qid]: val };
    setAnswers(updated);
    localStorage.setItem(`exam-${examId}-answers`, JSON.stringify(updated));
  };

  // Submit exam
  const handleSubmit = async (expired = false) => {
    const payload = Object.entries(answers).map(([qid, selected_answer]) => ({
      question: qid,
      selected_answer
    }));

    try {
      const res = await api.post("/exams/submit-answer/", payload);
      setScore({
        ...res.data,
        message: expired
          ? "Time is up. Your exam was auto-submitted."
          : res.data.message
      });
      setSubmitted(true);
      localStorage.removeItem(`exam-${examId}-answers`);
    } catch (err) {
      console.error("Submit failed", err);
    }
  };

  // Loading state
  if (loading) return <Typography p={2}>Loading exam...</Typography>;

  // Review screen if already submitted
  if (submitted) {
    return (
      <Box maxWidth={800} mx="auto" p={2}>
        <Typography variant="h5">{score?.message || "Exam already submitted."}</Typography>
        <Typography>Score: {score?.score}</Typography>
        <Typography>Correct: {score?.correct_answers}</Typography>
        <Typography>Attempted: {score?.total_attempted}</Typography>

        <Typography variant="h6" mt={4}>Your Answers</Typography>
        {questions.map((q, i) => (
          <Box key={q.id} mt={2} p={2} border="1px solid #ccc" borderRadius={2}>
            <Typography><strong>Q{i + 1}:</strong> {q.text}</Typography>
            <Typography>A. {q.option_a}</Typography>
            <Typography>B. {q.option_b}</Typography>
            <Typography>C. {q.option_c}</Typography>
            <Typography>D. {q.option_d}</Typography>
            <Typography sx={{ mt: 1 }} color="primary">
              Your Answer: {answers[q.id] || "Not Answered"}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }

  // Live exam screen
  const q = questions[currentQ];
  const time = `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`;

  return (
    <Box maxWidth={800} mx="auto" p={2}>
      <Typography variant="h6">Time Left: {time}</Typography>
      <Typography variant="h5">Q{currentQ + 1}: {q.text}</Typography>

      <RadioGroup
        value={answers[q.id] || ""}
        onChange={(e) => handleOptionSelect(q.id, e.target.value)}
      >
        <FormControlLabel value="A" control={<Radio />} label={q.option_a} />
        <FormControlLabel value="B" control={<Radio />} label={q.option_b} />
        <FormControlLabel value="C" control={<Radio />} label={q.option_c} />
        <FormControlLabel value="D" control={<Radio />} label={q.option_d} />
      </RadioGroup>

      {currentQ < questions.length - 1 ? (
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          disabled={!answers[q.id]}
          onClick={() => setCurrentQ((prev) => prev + 1)}
        >
          Next
        </Button>
      ) : (
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          disabled={!answers[q.id]}
          onClick={() => handleSubmit(false)}
        >
          Submit
        </Button>
      )}
    </Box>
  );
};

export default roleHoc(ExamPerform, ["Student"]);
