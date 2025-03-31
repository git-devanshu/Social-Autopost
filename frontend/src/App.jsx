import React from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import { ChakraProvider } from '@chakra-ui/react'

import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import AutoPost from './pages/Dashboard1';
import Connect from './pages/Connect';

export default function App() {
    return (
        <ChakraProvider>
            <BrowserRouter>
                <Routes>
                    {/* Authentication Routes */}
                    <Route path='/' element={<CheckLoggedIn />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/forgot-password' element={<ForgotPassword />} />
                    <Route path='/reset-password/:email' element={<ResetPassword />} />

                    {/* Main Pages */}
                    <Route path='/dashboard' element={<ProtectedDashboard />} />
                    <Route path='/connect-profiles' element={<ProtectedConnectProfiles />} />
                    {/* <Route path='/schedule-posts' element={< />} /> */}
                    {/* <Route path='/history' element={< />} /> */}
                    {/* <Route path='/profile' element={< />} /> */}
                    {/* <Route path='/' element={< />} /> */}
        
                    {/* Fallback route : 404 Not found page */}
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </BrowserRouter>
            <Toaster position="top-right" toastOptions={{style: {background: '#ddd', color: '#111111', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', border: '1px solid #666'}}} />
        </ChakraProvider>
    )
}

const CheckLoggedIn = () =>{
    const token = localStorage.getItem('token');
    if(token){
        return <Navigate to='/dashboard'/>
    }
    else{
        return <Login/>
    }
}

const ProtectedDashboard = () =>{
    const token = localStorage.getItem('token');
    if(token){
        return <AutoPost />
    }
    else{
        return <Navigate to='/' />
    }
}

const ProtectedConnectProfiles = () =>{
    const token = localStorage.getItem('token');
    if(token){
        return <Connect />
    }
    else{
        return <Navigate to='/' />
    }
}