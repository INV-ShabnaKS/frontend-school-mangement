import React from 'react';
import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography } from "@mui/material";
import api from '../api/axios'

const ForgotPassword = () =>{
    const {
        register,
        handleSubmit,
        formState : {errors},
    } = useForm();
    const onSubmit = async(data) =>
    {
        try{
            const response= await api.post('/forgot-password',{
                email:data.email,
            });
            alert("Reset link sent to your email");
            console.log(response.data);
        } catch (error) {
            alert(error.response?.data?.error || "Something went wrong");
            console.error(error);
        }
    };


    return(
        <div>
            <Box sx={{backgroundColor:'whitesmoke', width:400, mx:"auto", mt:10, p:4, borderRadius:2 }}>
                <Typography variant="h5" gutterBottom>Forgot Password</Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField label="Email" fullWidth {...register("email",{required:"Email is required"})}
                        error={!!errors.email}
                        helperText={errors.email?.message} margin="normal" />
                    <Button type="sumbit" variant="containd" fullWidth>Send Reset Link</Button>

                </form>

            </Box>
           
        </div>
    );
   
};
export default ForgotPassword;