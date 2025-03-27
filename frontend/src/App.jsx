import React from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import { ChakraProvider } from '@chakra-ui/react'

import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';


export default function App() {
    return (
        <ChakraProvider>
            <BrowserRouter>
                <Routes>
                    {/* Authentication Routes */}
                    <Route path='/' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/forgot-password' element={<ForgotPassword />} />
                    <Route path='/reset-password/:email' element={<ResetPassword />} />

                    {/* Main Page */}
                    {/* <Route path='/dashboard' element={< />} /> */}
                    {/* <Route path='/' element={< />} /> */}
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

