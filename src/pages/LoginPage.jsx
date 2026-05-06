import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './AuthPages.css';

const LoginPage = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const result = await login({ email: form.email, password: form.password });
    if (result.success) {
      const role = result.data.role;
      navigate(role === 'admin' ? '/admin' : role === 'organizer' ? '/organizer' : '/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <Link to="/" className="auth-logo">✦ EventPulse</Link>
          <h1>Welcome Back</h1>
          <p>Sign in to access your dashboard, manage bookings, and discover amazing events.</p>
          <div className="auth-features">
            {['Browse 2,400+ events', 'Instant QR tickets', 'Exclusive member deals', 'Manage your bookings'].map(f => (
              <div key={f} className="auth-feature"><span>✓</span> {f}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Good Afternoon! 👋</h2>
            <p>Welcome back to EventPulse</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon-wrap">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-wrap">
                <span className="input-icon">🔒</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className={errors.password ? 'error' : ''}
                />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            <div className="auth-options">
              <label className="checkbox-label">
                <input type="checkbox" /> Remember Me
              </label>
              <a href="#!" className="forgot-link">Reset Password</a>
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Login →'}
            </button>

            <div className="auth-divider"><span>OR Login with</span></div>
            <div className="social-auth">
              {['📘 Facebook', '🔴 Google', '🐦 Twitter'].map(s => (
                <button key={s} type="button" className="social-btn">{s}</button>
              ))}
            </div>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Register!</Link>
          </p>
          <p className="auth-terms">By continuing you confirm that you agree with our <a href="#!">Terms & Conditions</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;