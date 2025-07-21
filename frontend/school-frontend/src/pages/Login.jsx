import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {Box,Button,TextField,Typography,Container,Paper,} from "@mui/material";
import { Link } from 'react-router-dom';




const Login = () => {
    const {
        register,
        handleSubmit,
        formState : {errors}
    } = useForm();
   
    const navigate = useNavigate();
    const { login, auth } = useAuth();
    const onSubmit = async(data) => {
        const result = await login(data.username, data.password);

        if (result.success) {
            navigate("/dashboard");
        } else {
            alert(result.message);
        }

        console.log("Submitted:", data);
    };

   

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="Username"
                        fullWidth
                        margin="normal"
                        {...register("username", { required: "Username is required" })}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Minimum 6 characters",
                            },  
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}/>

                    <Button type="submit" variant="contained" fullWidth sx={{backgroundColor:"#080808"}}>Login</Button>
                </form>
                <Typography variant="body2" align="right" >
                    <Link to="/forgot-password" sx={{color:"black"}}>Forgot Password?</Link>
                </Typography>

            </Paper>
        </Container>
    );

};
export default Login;