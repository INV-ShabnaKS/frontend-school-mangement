import React from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography } from '@mui/material';
import api from '../api/axios';
 
const ResetPassword = () =>{
    const {uid, token}=useParams();
    console.log(uid, token)
    return(
        <div>
            <Typography>Reset Password</Typography>
            
        </div>
    )
}