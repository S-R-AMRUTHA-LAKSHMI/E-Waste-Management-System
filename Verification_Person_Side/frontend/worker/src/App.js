

// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from './LoginComponent';
import SignupComponent from './SignupComponent';
import HomeComponent from './HomeComponent';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginComponent />} />
                <Route path="/signup" element={<SignupComponent />} />
                <Route path="/home" element={<HomeComponent />} />
                <Route path="/" element={<LoginComponent />} />
            </Routes>
        </Router>
    );
};

export default App;
