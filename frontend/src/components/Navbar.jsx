import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="navbar" style={{ background: '#fff', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 5%', minHeight: '44px' }}>
      <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="AncestryNest Logo" style={{ height: '40px', background: 'white' }} />
        <span style={{ fontWeight: 700, fontSize: 20, marginLeft: 10 }}></span>
      </div>
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {user ? (
          <>
            <span>Welcome, {user.username}</span>
            <button onClick={logout} className="nav-btn" style={{ background: '#666', fontSize: '0.9em', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <>
            {location.pathname !== '/login' && <Link to="/login" className="nav-link">Login</Link>}
            {location.pathname !== '/signup' && <Link to="/signup" className="nav-btn-primary" style={{ background: '#007bff', color: '#fff', borderRadius: 4, padding: '6px 16px', textDecoration: 'none' }}>Sign Up</Link>}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;