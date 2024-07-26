import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApplicationList from './components/ApplicationList';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ApplicationList />} />
            </Routes>
        </Router>
    );
}

export default App;
