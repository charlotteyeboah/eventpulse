import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './AuthPages.css';

const SignupPage = () => {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'user', phone: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleNext = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const result = await signup({ name: form.name, email: form.email, password: form.password, role: form.role, phone: form.phone });
    if (result.success) {
      navigate(form.role === 'organizer' ? '/organizer' : '/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-left signup-left">
        <div className="auth-left-content">
          <Link to="/" className="auth-logo">EventPulse</Link>
          <h1>Join EventPulse</h1>
          <p>Create your account and start discovering events.</p>
          <div className="signup-roles">
            <div className={form.role === 'user' ? 'role-card active' : 'role-card'} onClick={() => setForm({ ...form, role: 'user' })}>
              <span>User</span>
            </div>
            <div className={form.role === 'organizer' ? 'role-card active' : 'role-card'} onClick={() => setForm({ ...form, role: 'organizer' })}>
              <span>Organizer</span>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Create Account</h2>
            <p>Sign up to continue</p>
            <div className="step-indicators">
              <div className={step >= 1 ? 'step-dot active' : 'step-dot'}>1</div>
              <div className="step-line" />
              <div className={step >= 2 ? 'step-dot active' : 'step-dot'}>2</div>
            </div>
          </div>
          {step === 1 ? (
            <div className="auth-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={errors.name ? 'error' : ''} />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="Enter your email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={errors.email ? 'error' : ''} />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>
              <div className="form-group">
                <label>Phone (Optional)</label>
                <input type="tel" placeholder="+971 XX XXX XXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Account Type</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="user">Attendee</option>
                  <option value="organizer">Organizer</option>
                </select>
              </div>
              <button type="button" className="btn btn-primary auth-submit" onClick={handleNext}>Continue</button>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Enter your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={errors.password ? 'error' : ''} />
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" placeholder="Re-enter your password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} className={errors.confirm ? 'error' : ''} />
                {errors.confirm && <p className="form-error">{errors.confirm}</p>}
              </div>
              <div className="form-row">
                <button type="button" className="btn btn-dark" onClick={() => setStep(1)}>Back</button>
                <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>{loading ? 'Loading...' : 'Create Account'}</button>
              </div>
            </form>
          )}
          <p className="auth-switch">Already have an account? <Link to="/login">Login!</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;