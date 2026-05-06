import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getMyBookings } from '../api';
import './Dashboard.css';

export const UserDashboard = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchBookings = async () => {
      try {
        const data = await getMyBookings();
        if (Array.isArray(data)) setBookings(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user, navigate]);

  if (!user) return null;

  const totalSpent = bookings.reduce((a, b) => a + (b.totalPrice || 0), 0);

  const stats = [
    { label: 'Tickets Booked', value: bookings.length, icon: '🎫', color: '#f0a500' },
{ label: 'Upcoming Events', value: bookings.filter(b => b.status === 'confirmed').length, icon: '', color: '#3b82f6' },
    { label: 'Total Spent', value: `AED ${totalSpent}`, icon: '', color: '#22c55e' },
    { label: 'Reviews Given', value: 0, icon: '', color: '#e8445a' },
  ];

  const SIDEBAR_LINKS = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'bookings', label: 'My Bookings', icon: '🎫' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="page-wrapper dashboard-page">
      <div className="container">
        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
            <div className="dashboard-profile">
              <div className="dash-avatar">{user.name?.charAt(0)}</div>
              <div>
                <p className="dash-name">{user.name}</p>
                <p className="dash-email">{user.email}</p>
                <span className="badge badge-gold">{user.role}</span>
              </div>
            </div>
            <nav className="dashboard-nav">
              {SIDEBAR_LINKS.map(link => (
                <button key={link.id}
                  className={`dash-nav-item ${activeSection === link.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(link.id)}>
                  {link.icon} {link.label}
                </button>
              ))}
              <Link to="/events" className="dash-nav-item">Browse Events</Link>
              {user.role === 'organizer' && <Link to="/organizer" className="dash-nav-item">Organizer Panel</Link>}
              {user.role === 'admin' && <Link to="/admin" className="dash-nav-item">Admin Panel</Link>}
              <button className="dash-nav-item logout" onClick={() => { logout(); navigate('/'); }}>Logout</button>
            </nav>
          </aside>

          <div className="dashboard-main">
            {activeSection === 'overview' && (
              <>
                <div className="dash-header">
                  <h2>Welcome, {user.name?.split(' ')[0]}! 👋</h2>
                  <p>Here's your account overview</p>
                </div>
                <div className="dash-stats">
                  {stats.map((s, i) => (
                    <div key={i} className="dash-stat-card" style={{ '--stat-color': s.color }}>
                      <span className="stat-icon-lg">{s.icon}</span>
                      <div>
                        <p className="dash-stat-value">{s.value}</p>
                        <p className="dash-stat-label">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="dash-section-title">My Upcoming Events</div>
                {loading ? (
                  <p>Loading bookings...</p>
                ) : bookings.length > 0 ? (
                  <div className="dash-events-list">
                    {bookings.slice(0, 3).map((booking, i) => (
                      <div key={i} className="dash-event-row">
                        <div className="dash-event-info">
                          <h4>{booking.event?.title || 'Event'}</h4>
                          <p>📍 {booking.event?.location || ''}</p>
                          <p>🎫 {booking.ticketType} x {booking.quantity}</p>
                        </div>
                        <div className="dash-event-actions">
                          <span className="badge badge-green">{booking.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="new-user-cta">
                    <div className="cta-card">
                      <span></span>
                      <div>
                        <h4>No bookings yet</h4>
                        <p>Browse hundreds of amazing events!</p>
                        <Link to="/events" className="btn btn-primary">Browse Events</Link>
                      </div>
                    </div>
                    <div className="cta-card">
                      <span>🎫</span>
                      <div>
                        <h4>How it works</h4>
                        <p>Find an event, choose your ticket, pay securely, get instant QR code</p>
                        <Link to="/events" className="btn btn-dark">Get Started</Link>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeSection === 'bookings' && (
              <div className="dash-content-area">
                <h3>My Bookings ({bookings.length})</h3>
                {bookings.length === 0 ? (
                  <div className="empty-state">
                    <span>🎫</span>
                    <p>No bookings yet. <Link to="/events">Browse events</Link> to get started!</p>
                  </div>
                ) : (
                  <div className="bookings-list">
                    {bookings.map((b, i) => (
                      <div key={i} className="booking-row">
                        <div className="booking-row-info">
                          <h4>{b.event?.title || 'Event'}</h4>
                          <p>{b.ticketType} x {b.quantity} ticket(s)</p>
                        </div>
                        <div className="booking-row-right">
                          <span className="badge badge-green">{b.status}</span>
                          <p className="booking-total">AED {b.totalPrice}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'profile' && (
              <div className="dash-content-area">
                <h3>Edit Profile</h3>
                <div className="profile-edit">
                  <div className="profile-avatar-large">{user.name?.charAt(0)}</div>
                  <div className="profile-form">
                    <div className="form-group"><label>Full Name</label><input defaultValue={user.name} /></div>
                    <div className="form-group"><label>Email</label><input defaultValue={user.email} /></div>
                    <div className="form-group"><label>Phone</label><input placeholder="+971 XX XXX XXXX" /></div>
                    <button className="btn btn-primary">Save Changes</button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="dash-content-area">
                <h3>Account Settings</h3>
                <div className="settings-list">
                  {['Email Notifications', 'SMS Alerts', 'Marketing Emails', 'Event Reminders'].map(s => (
                    <div key={s} className="setting-row">
                      <span>{s}</span>
                      <label className="toggle">
                        <input type="checkbox" defaultChecked={s !== 'Marketing Emails'} />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;