import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import ChatRoom from './pages/ChatRoom';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/chat" element={<ChatRoom />} />
            </Routes>
        </Router>
    );
}

export default App;

// The first route means the automatically redirect the user to the login page when they open the program "/". The "replace" means don't save that home page in the history so if the user was to "go back", it would just remain on the login page

//"element" means when the URL path is /login, render the Login component. The same for the remaining