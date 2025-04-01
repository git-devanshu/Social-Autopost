import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {toast} from 'react-hot-toast';
import {getBaseURL} from '../utils/helperFunctions';

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');

    const verifyUser = (e) =>{
        e.preventDefault();
        const toastId = toast.loading('Verifying email...');
        axios.post(getBaseURL() + '/auth/forgot-password', {email})
        .then(res => {
            if(res.status === 200){
                toast.success(res.data.message, {id :toastId});
                setTimeout(()=>{
                    navigate(`/reset-password/${email}`);
                }, 1500);
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id :toastId});
        });
    }

    return (
        <div>
            <form>
                <label>Email</label>
                <input type="text" name='email' value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                <button onClick={verifyUser}>
                    Send Verification Code
                </button>
                <p>
                    Try Login? <a href="/">Login</a>
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;
