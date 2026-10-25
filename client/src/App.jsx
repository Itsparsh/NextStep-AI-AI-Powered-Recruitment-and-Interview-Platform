import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import './index.css';

// Code-split route components for optimal production bundle size
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const VerifyEmail = lazy(() => import('./components/VerifyEmail'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const ScreeningRoom = lazy(() => import('./components/ScreeningRoom'));

// Reusable Logo Component
export const AppLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <img 
      src="/logo.png" 
      alt="NextStep AI Logo" 
      style={{ height: '48px', width: 'auto', objectFit: 'contain', borderRadius: '8px' }}
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
  </div>
);

// Graceful fallback while route chunks are loaded
const RouteLoader = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0d1117',
      color: '#94a3b8',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          width: '38px',
          height: '38px',
          border: '3px solid rgba(59, 130, 246, 0.2)',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 14px'
        }}
      />
      <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8' }}>
        Loading NextStep AI...
      </p>
    </div>
  </div>
);

// Main App Router
function App() {
  return (
    <Router>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applications" element={<Dashboard initialTab="applications" />} />
          <Route path="/jobs" element={<Dashboard initialTab="jobs" />} />
          <Route path="/screening" element={<ScreeningRoom />} />
          <Route path="/screening/:roomId" element={<ScreeningRoom />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

