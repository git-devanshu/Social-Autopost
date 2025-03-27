import React, { useState } from "react";
import { HStack, PinInput, PinInputField } from "@chakra-ui/react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import {toast} from 'react-hot-toast';
import {getBaseURL} from '../utils/helperFunctions';

const ResetPassword = () => {
    const navigate = useNavigate();
    const {email} = useParams();

    const [vfcode, setVfcode] = useState('');
    const [password, setPassword] = useState('');

    const resetPassword = (e) =>{
        e.preventDefault();
        const toastId = toast.loading('Setting new password...');
        axios.post(getBaseURL()+'/auth/reset-password', {vfcode, password, email})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id :toastId});
                setTimeout(()=>{
                    navigate('/')
                }, 1500);
            }
            else{
                toast.error(res.data.message, {id :toastId});
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
                <label>Verification Code</label>
                <div style={{display: 'grid', placeItems: 'center', marginTop: '10px', marginBottom: '10px'}}>
                    <HStack>
                        <PinInput type="number" value={vfcode} onChange={(value) => setVfcode(value)}>
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                        </PinInput>
                    </HStack>
                </div>
                <label>New Password</label>
                <input type="password" name='password' value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={8} maxLength={30}/>
                <button onClick={resetPassword}>
                    Confirm
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
