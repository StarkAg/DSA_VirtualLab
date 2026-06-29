import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Experiment from './pages/Experiment.jsx';
import Admin from './pages/Admin.jsx';
import McqQuiz from './pages/McqQuiz.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/quiz" element={<McqQuiz />} />
      <Route path="/dashboard" element={<AppShell><Dashboard /></AppShell>} />
      <Route path="/experiment/:id" element={<AppShell><Experiment /></AppShell>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
