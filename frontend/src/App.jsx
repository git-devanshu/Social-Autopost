import React from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import { ChakraProvider } from '@chakra-ui/react'

import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import ConnectProfiles from './pages/ConnectProfiles';

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

                    {/* Main Page */}
                    <Route path='/dashboard' element={<ProtectedDashboard />} />
                    <Route path='/connect-profiles' element={<ProtectedConnectProfiles />} />
                    {/* <Route path='/' element={< />} /> */}
                    {/* <Route path='/' element={< />} /> */}
                    {/* <Route path='/' element={< />} /> */}
                    {/* <Route path='/' element={< />} /> */}

                    {/* Fallback route 404 Not found page */}
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </BrowserRouter>
            <Toaster/>
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
        return <Dashboard />
    }
    else{
        return <Navigate to='/' />
    }
}

const ProtectedConnectProfiles = () =>{
    const token = localStorage.getItem('token');
    if(token){
        return <ConnectProfiles />
    }
    else{
        return <Navigate to='/' />
    }
}