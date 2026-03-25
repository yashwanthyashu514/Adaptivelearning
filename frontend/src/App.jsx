import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Kids from './pages/Kids';
import Student from './pages/Student';
import Adult from './pages/Adult';
import Exam from './pages/Exam';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="app-content">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/kids" element={<Kids />} />
              <Route path="/student" element={<Student />} />
              <Route path="/adult" element={<Adult />} />
              <Route path="/exam" element={<Exam />} />
            </Routes>
          </AnimatePresence>
        </main>
        <footer className="app-footer">
          <p>© 2026 Adaptive Learning Platform. Empowering every individual through intelligence.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
