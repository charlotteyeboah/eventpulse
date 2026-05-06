import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, cartCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="navbar-inner container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">EventPulse</span>
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/events" className={`nav-link ${isActive('/events') ? 'active' : ''}`}>Events</Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
          {user?.role === 'organizer' && (
            <Link to="/organizer" className={`nav-link ${isActive('/organizer') ? 'active' : ''}`}>My Events</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>Admin</Link>
          )}
        </div>

        <div className="nav-actions">
          <Link to="/cart" className="cart-btn">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu" onMouseLeave={() => setDropdownOpen(false)}>
              <button
                className="user-avatar-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onMouseEnter={() => setDropdownOpen(true)}
              >
                <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span className="user-name">{user.name?.split(' ')[0]}</span>
                <span className="chevron">▾</span>
              </button>
              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="avatar large">{user.name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <p className="dropdown-name">{user.name}</p>
                      <p className="dropdown-email">{user.email}</p>
                      <span className="badge badge-gold">{user.role}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    My Dashboard
                  </Link>
                  <Link to="/bookings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    My Bookings
                  </Link>
                  {user.role === 'organizer' && (
                    <Link to="/organizer" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      Organizer Panel
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <div className="dropdown-divider" />
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-outline-dark">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </div>
          )}

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
