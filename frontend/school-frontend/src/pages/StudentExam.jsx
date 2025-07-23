import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import roleHoc from "../hoc/roleHoc";

const StudentExam = () => {
  // State to store all exams from the backend
  const [exams, setExams] = useState([]);

  // State to keep track of which exams have been submitted by this student
  const [submittedMap, setSubmittedMap] = useState({});

  // To show loading while fetching data
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadExams = async () => {
      try {
        // 1. Get all exams
        const res = await api.get("/exams/exams/");
        const examList = Array.isArray(res.data) ? res.data : res.data.results || [];
        setExams(examList);

        // 2. Check submission status for each exam
        const status = await Promise.all(
          examList.map(async (exam) => {
            try {
              await api.get(`/exams/student-score?exam_id=${exam.id}`);
              return { id: exam.id, submitted: true };
            } catch {
              return { id: exam.id, submitted: false };
            }
          })
        );

        // 3. Build map of { examId: true/false }
        const map = Object.fromEntries(status.map(({ id, submitted }) => [id, submitted]));
        setSubmittedMap(map);
      } catch (err) {
        console.error("Error loading exams:", err);
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, []);

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
        <Typography mt={2}>Loading exams…</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth={800} mx="auto" p={2}>
      <Typography variant="h5" gutterBottom>Available Exams</Typography>

      {exams.map((exam) => {
        const isSubmitted = submittedMap[exam.id];

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
