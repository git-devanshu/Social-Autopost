import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {toast} from 'react-hot-toast';
import {getBaseURL} from '../utils/helperFunctions';

const Signup = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email : '',
        name : '',
        password : ''
    });

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setUser({
            ...user,
            [name] : value
        });
    }

    const registerUser = (e) =>{
        e.preventDefault();
        const toastId = toast.loading('Registering...');
        axios.post(getBaseURL() + '/auth/signup', user)
        .then(res =>{
            if(res.status === 201){
                toast.success(res.data.message, {id : toastId});
                setTimeout(()=>{
                    navigate('/');
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
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                />

                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={user.name}
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

                <button onClick={registerUser}>Signup</button>
            </form>
            <p>
                Already registered? <a href="/">Login</a>
            </p>
        </div>
    );
};

export default Signup;
