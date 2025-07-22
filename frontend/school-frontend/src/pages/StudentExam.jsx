import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Box, Typography, Button } from "@mui/material";
import roleHoc from "../hoc/roleHoc";

const StudentExam = () => {
  const [exams, setExams] = useState([]);
  const [submittedExams, setSubmittedExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get("/exams/exams/");
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setExams(data);

        // Check which exams are already submitted
        const submitted = [];
        for (const exam of data) {
          try {
            await api.get(`/student-score?exam_id=${exam.id}`);
            submitted.push(exam.id);
          } catch (e) {
            // Not submitted → do nothing
          }
        }

        setSubmittedExams(submitted);
      } catch (err) {
        console.error("Failed to fetch exams", err);
      }
    };

    fetchExams();
  }, []);

  return (
    <Box maxWidth={800} mx="auto" p={2}>
      <Typography variant="h5" gutterBottom>Available Exams</Typography>
      {exams.map((exam) => {
        const isSubmitted = submittedExams.includes(exam.id);
        return (
          <Box key={exam.id} mt={2} p={2} border="1px solid #ccc" borderRadius={2}>
            <Typography variant="h6">{exam.title}</Typography>
            <Typography>{exam.description}</Typography>
            <Button
              variant="contained"
              disabled={isSubmitted}
              onClick={() => navigate(`/dashboard/exams/${exam.id}/start`)}
              sx={{
                mt: 1,
                backgroundColor: isSubmitted ? "#888" : "#0f0f0f",
                color: "white"
              }}
            >
              {isSubmitted ? "Already Submitted" : "Start Exam"}
            </Button>
          </Box>
        );
      })}
    </Box>
  );
};

export default roleHoc(StudentExam, ["Student"]);
