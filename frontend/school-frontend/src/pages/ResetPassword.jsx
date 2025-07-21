import React from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import api from '../api/axios';
 
const ResetPassword = () =>{
    const {uid, token}=useParams();
    console.log(uid, token)
    const navigate = useNavigate();
    const {register,handleSubmit,formState: { errors },
    } = useForm();
    const onSubmit = async(data) => { console.log(data);
        if (data.password!= data.confirm_password){
            alert("Passwords do not match");
            return;
        }
        try{
            await api.post(`/reset-password/${uid}/${token}/`, { password: data.password });
            alert("Password reset successful");
            navigate("/login");


        }catch(error){
            alert("link expired or somrthing went wrong");

        }
     }


    return(
        <Box sx={{minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", px:2, bgcolor:"#f0f0f0"}}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{maxWidth:400, width:"100%", mx:"auto",bgcolor:"whitesmoke"}}>
                    <Typography align="center" variant="h5" sx={{ mb: 2 }}>Reset Password</Typography>
                    <TextField type="password" label="New Password" fullWidth sx={{mt:2}} {...register("password", { required: "Password is required" })} />
                        {errors.password && (<Typography variant="body2" color="error">
                        {errors.password.message}</Typography>)}
                    <TextField type="password" label="Confirm Password" fullWidth sx={{mt:2}} {...register("confirm_password", { required: "Please Confirm your Password" })} />
                        {errors.confirm_password && (<Typography variant="body2" color="error">
                        {errors.confirm_password.message}</Typography>)}
                    <Button type="submit" fullWidth variant="contained" sx={{mt:2,backgroundColor:'black', color:"white"}}>Reset Password</Button>

            
                </Box>
            </form>
        </Box>
    )
}
export default ResetPassword;