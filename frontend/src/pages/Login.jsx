import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {toast} from 'react-hot-toast';
import {getBaseURL} from '../utils/helperFunctions';

const Login = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email : '',
        password : ''
    });

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setUser({
            ...user,
            [name] : value
        });
    }

    const loginUser = (e) =>{
        e.preventDefault();
        const toastId = toast.loading('Logging in...');
        axios.post(getBaseURL() + '/auth/login', user)
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                localStorage.setItem('token', res.data.token);
                setTimeout(()=>{
                    navigate('/dashboard');
                }, 1500);
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id : toastId});
        });
    }

    return (
        <div>
            <form>
                <label>Email</label>
                <input
                    type="text"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                />

                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    maxLength={30}
                />

                <a href="/forgot-password">Forgot Password?</a>

                <button onClick={loginUser}>Login</button>
            </form>
            <p>
                New User? <a href="/signup">Signup</a>
            </p>
        </div>
    );
};

export default Login;