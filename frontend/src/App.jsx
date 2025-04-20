import React from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import { ChakraProvider } from '@chakra-ui/react'
import {decodeToken} from './utils/helperFunctions';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import AutoPost from './pages/Dashboard';
import Connect from './pages/Connect';
import History from './pages/History';
import FAQPage from './pages/FAQPage';
import HelpPage from './pages/HelpPage';
import AboutUs from './pages/AboutUs';

export default function App() {
    return (
        <ChakraProvider>
            <BrowserRouter>
                <Routes>
                    {/* Authentication Routes */}
                    <Route path='/' element={<CheckLoggedIn />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/forgot-password' element={<ForgotPassword />} />

                    {/* Main Pages */}
                    <Route path='/dashboard' element={<ProtectedDashboard />} />
                    <Route path='/connect-profiles' element={<ProtectedConnectProfiles />} />
                    <Route path='/history' element={<ProtectedHistory />} />
                    <Route path='/questions' element={<FAQPage />} />
                    <Route path='/help' element={<HelpPage />} />
                    <Route path='/about-us' element={<AboutUs />} />
                    {/* <Route path='/schedule-posts' element={< />} /> */}
                    {/* <Route path='/profile' element={< />} /> */}
        
                    {/* Fallback route : 404 Not found page */}
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </BrowserRouter>
            <Toaster
                position='top-right'
                toastOptions={{
                    style: {background: "white", color: "#374151", fontSize: "15px", height: '60px', width: '400px', borderRadius: '8px', borderLeft: '12px solid #666'},
                    success: {style: { borderLeft: "12px solid #22c55e" }},
                    error: {style: { borderLeft: "12px solid #ef4444" }},
                    loading : {style: {borderLeft: "12px solid #d1d5db"}}
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

const ProtectedHistory = () =>{
    const decodedToken = decodeToken(localStorage.getItem('token'));
    if(decodedToken && decodedToken.id){
        return <History />
    }
    else{
        return <Navigate to='/' />
    }
}