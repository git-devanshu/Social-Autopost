import React from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import { ChakraProvider } from '@chakra-ui/react'
import {decodeToken} from './utils/helperFunctions';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
// import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import AutoPost from './pages/Dashboard';
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
                    {/* <Route path='/reset-password/:email' element={<ResetPassword1 />} /> */}

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
            <Toaster
                position='top-right'
                toastOptions={{
                    style: {
                        background: "white",
                        border: "1px solid #d1d5db",
                        color: "#374151",
                        fontSize: "16px",
                    },
                    success: {
                        style: { border: "2px solid #22c55e" },
                    },
                    error: {
                        style: { border: "2px solid #ef4444" },
                    },
                }}
            />
        </ChakraProvider>
    )
}

const CheckLoggedIn = () =>{
    const decodedToken = decodeToken(localStorage.getItem('token'));
    if(decodedToken && decodedToken.id){
        return <Navigate to='/dashboard'/>
    }
    else{
        return <Login/>
    }
}

const ProtectedDashboard = () =>{
    const decodedToken = decodeToken(localStorage.getItem('token'));
    if(decodedToken && decodedToken.id){
        return <AutoPost />
    }
    else{
        return <Navigate to='/' />
    }
}

const ProtectedConnectProfiles = () =>{
    const decodedToken = decodeToken(localStorage.getItem('token'));
    if(decodedToken && decodedToken.id){
        return <Connect />
    }
    else{
        return <Navigate to='/' />
    }
}