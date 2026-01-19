import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FamilyTree from './components/FamilyTree';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider, useAuth } from './context/AuthContext';
import logo from './assets/logo.png';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const DashboardLayout = ({ children }) => {
  const { logout, user } = useAuth();
  return (
    <div>
      <nav className="navbar" style={{ padding: '10px 20px', background: '#fff', borderBottom: '1px solid #eee' }}>
        <div className="logo"><img src={logo} alt="AncestryNest Logo" style={{ height: '60px', background: 'white' }} /></div>
        <div className="nav-links">
          <span>Welcome, {user?.username}</span>
          <button onClick={logout} className="nav-btn" style={{ background: '#666', fontSize: '0.9em' }}>Logout</button>
        </div>
      </nav>
      {children}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardLayout>
                <FamilyTree />
              </DashboardLayout>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
