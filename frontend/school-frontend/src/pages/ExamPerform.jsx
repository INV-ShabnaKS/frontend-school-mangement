import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
} from "@mui/material";
import api from "../api/axios";
import roleHoc from "../hoc/roleHoc";

const ExamPerform = () => {
  const { examId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null); // ✅ to store result
  const [timer, setTimer] = useState(300);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await api.post(`/exams/start/${examId}/`);
      } catch (err) {
        // It’s okay if already started
      }

      try {
        const questionsRes = await api.get(`/exams/questions/?exam=${examId}`);
        const qdata = Array.isArray(questionsRes.data)
          ? questionsRes.data
          : questionsRes.data.results || [];

        setQuestions(qdata);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load questions:", err);
        setLoading(false);
      }
    };

    init();
  }, [examId]);

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

  const handleOptionSelect = (qid, val) => {
    setAnswers((prev) => ({ ...prev, [qid]: val }));
  };

  const handleSubmit = async (expired = false) => {
    const payload = Object.entries(answers).map(([qid, selected_answer]) => ({
      question: qid,
      selected_answer,
    }));

    try {
      const res = await api.post("/exams/submit-answer/", payload);

      setScore({
        message: expired
          ? "Time is up. Your exam was auto-submitted."
          : res.data.message,
        total: res.data.total_attempted,
        correct: res.data.correct_answers,
        marks: res.data.score,
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Submit failed", err);
    }
  };

  const q = questions?.[currentQ];
  const time = `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`;

  if (loading) return <Typography p={2}>Loading exam...</Typography>;

  if (submitted) {
    return (
      <Box maxWidth={800} mx="auto" p={2}>
        <Typography variant="h5" color="success.main">Exam Submitted Successfully!</Typography>
        {score && (
          <Box mt={2}>
            <Typography>{score.message}</Typography>
            <Typography>Score: {score.marks}</Typography>
            <Typography>Correct Answers: {score.correct}</Typography>
            <Typography>Total Attempted: {score.total}</Typography>
          </Box>
        )}
      </Box>
    );
  }

  if (!q) {
    return (
      <Box maxWidth={800} mx="auto" p={2}>
        <Typography color="error">Unable to display this question.</Typography>
      </Box>
    );
  }

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
