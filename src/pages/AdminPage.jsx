import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAdminUsers, getAdminStats, getEvents, deleteEvent, getCategories } from '../api';
import './AdminPage.css';

const AdminPage = () => {
  const { user, addNotification } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalOrganizers: 0 });
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', icon: '', description: '' });

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    const fetchData = async () => {
      try {
        const [usersData, statsData, eventsData, categoriesData] = await Promise.all([
          getAdminUsers(),
          getAdminStats(),
          getEvents(),
          getCategories()
        ]);
        if (Array.isArray(usersData)) setUsers(usersData);
        if (statsData.totalUsers !== undefined) setStats(statsData);
        if (Array.isArray(eventsData)) setEvents(eventsData);
        if (Array.isArray(categoriesData)) setCategories(categoriesData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id);
      setEvents(prev => prev.filter(e => e._id !== id));
      addNotification('Event deleted!', 'success');
    } catch (error) {
      addNotification('Failed to delete event', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem('ep_token');
      await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(prev => prev.filter(u => u._id !== id));
      addNotification('User deleted!', 'success');
    } catch (error) {
      addNotification('Failed to delete user', 'error');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('ep_token');
      const res = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newCategory)
      });
      const data = await res.json();
      if (data._id) {
        setCategories(prev => [...prev, data]);
        addNotification('Category added!', 'success');
        setNewCategory({ name: '', icon: '', description: '' });
      }
    } catch (error) {
      addNotification('Failed to add category', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const token = localStorage.getItem('ep_token');
      await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(prev => prev.filter(c => c._id !== id));
      addNotification('Category deleted!', 'success');
    } catch (error) {
      addNotification('Failed to delete category', 'error');
    }
  };const totalRevenue = stats.totalRevenue || 0;

  const adminStats = [
    { label: 'Total Users', value: stats.totalUsers, icon: '', color: '#3b82f6' },
    { label: 'Organizers', value: stats.totalOrganizers, icon: '', color: '#e8445a' },
    { label: 'Total Events', value: stats.totalEvents || events.length, icon: '', color: '#f0a500' },
{ label: 'Total Revenue', value: `AED ${totalRevenue.toLocaleString()}`, icon: '', color: '#22c55e' },
  ];

  const TABS = ['overview', 'events', 'users', 'categories', 'reports'];

  return (
    <div className="page-wrapper admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <span className="badge badge-red">Admin Panel</span>
            <h1 className="section-title" style={{ marginTop: 8 }}>System Dashboard</h1>
            <p className="section-subtitle">Monitor and manage the EventPulse platform</p>
          </div>
          <div className="admin-header-actions">
            <button className="btn btn-dark" onClick={() => addNotification('Report exported!', 'success')}>Export Report</button>
          </div>
        </div>

        <div className="admin-stats">
          {adminStats.map((s, i) => (
            <div key={i} className="admin-stat-card" style={{ '--c': s.color }}>
              <div className="admin-stat-icon">{s.icon}</div>
              <div className="admin-stat-info">
                <p className="admin-stat-value">{s.value}</p>
                <p className="admin-stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-tabs">
          {TABS.map(t => (
            <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`}
              onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow)' }}>
            <h4 style={{ marginBottom: 16 }}>Platform Summary</h4>
            <p style={{ marginBottom: 8 }}>Total Users: <strong>{stats.totalUsers}</strong></p>
            <p style={{ marginBottom: 8 }}>Total Organizers: <strong>{stats.totalOrganizers}</strong></p>
            <p style={{ marginBottom: 8 }}>Total Events: <strong>{events.length}</strong></p>
            <p style={{ marginBottom: 8 }}>Total Revenue: <strong>AED {totalRevenue.toLocaleString()}</strong></p>
          </div>
        )}

        {/* EVENTS */}
        {activeTab === 'events' && (
          <div className="admin-table">
            <div className="at-header">
              <span>Event</span>
              <span>Category</span>
              <span>Date</span>
              <span>Price</span>
              <span>Capacity</span>
              <span>Actions</span>
            </div>
            {loading ? <p style={{ padding: 20 }}>Loading...</p> :
              events.map(event => (
                <div key={event._id} className="at-row">
                  <div className="at-event">
                    <div>
                      <p className="at-event-title">{event.title}</p>
                    </div>
                  </div>
                  <span><span className="badge badge-gold">{event.category}</span></span>
                  <span>{new Date(event.date).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span>{event.price === 0 ? 'FREE' : `AED ${event.price}`}</span>
                  <span>{event.capacity}</span>
                  <div className="at-actions">
                    <button className="action-btn delete" onClick={() => handleDeleteEvent(event._id)}>Delete</button>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* USERS */}
        {activeTab === 'users' && (
          <div className="admin-table">
            <div className="au-header" style={{ gridTemplateColumns: '1.5fr 2fr 0.8fr 0.8fr' }}>
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Actions</span>
            </div>
            {loading ? <p style={{ padding: 20 }}>Loading users...</p> :
              users.map((u, i) => (
                <div key={i} className="au-row" style={{ gridTemplateColumns: '1.5fr 2fr 0.8fr 0.8fr' }}>
                  <div className="au-user">
                    <div className="small-avatar">{u.name?.charAt(0)}</div>
                    {u.name}
                  </div>
                  <span>{u.email}</span>
                  <span><span className={`badge ${u.role === 'organizer' ? 'badge-gold' : u.role === 'admin' ? 'badge-red' : 'badge-blue'}`}>{u.role}</span></span>
                  <div className="at-actions">
                    <button className="action-btn delete" onClick={() => handleDeleteUser(u._id)}>🗑️ Delete</button>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* CATEGORIES */}
        {activeTab === 'categories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 80 }}>
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow)' }}>
              <h4 style={{ marginBottom: 16 }}>Add New Category</h4>
              <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <input required placeholder="Category name" value={newCategory.name}
                  onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                  style={{ flex: 1, padding: '10px 16px', border: '1.5px solid #eaeaea', borderRadius: 8, fontFamily: 'inherit' }} />
                <input placeholder="Icon (emoji)" value={newCategory.icon}
                  onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })}
                  style={{ width: 120, padding: '10px 16px', border: '1.5px solid #eaeaea', borderRadius: 8, fontFamily: 'inherit' }} />
                <input placeholder="Description" value={newCategory.description}
                  onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                  style={{ flex: 2, padding: '10px 16px', border: '1.5px solid #eaeaea', borderRadius: 8, fontFamily: 'inherit' }} />
                <button type="submit" className="btn btn-primary">+ Add</button>
              </form>
            </div>

            <div className="admin-table">
              <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 1fr 2fr 0.8fr', gap: 12, padding: '14px 20px', background: 'var(--primary)', color: 'white', fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
                <span>Icon</span><span>Name</span><span>Description</span><span>Actions</span>
              </div>
              {categories.length === 0 ? (
                <p style={{ padding: 20 }}>No categories yet.</p>
              ) : categories.map((cat, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '0.5fr 1fr 2fr 0.8fr', gap: 12, padding: '14px 20px', borderBottom: '1px solid #eaeaea', alignItems: 'center', fontSize: 13 }}>
                  <span style={{ fontSize: 24 }}>{cat.icon}</span>
                  <span style={{ fontWeight: 700 }}>{cat.name}</span>
                  <span style={{ color: '#4b5563' }}>{cat.description || '—'}</span>
                  <button className="action-btn delete" onClick={() => handleDeleteCategory(cat._id)}>🗑️ Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORTS */}
        {activeTab === 'reports' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 80 }}>
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow)' }}>
              <h4 style={{ marginBottom: 16 }}>Revenue Report</h4>
              <p style={{ fontSize: 36, fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>AED {totalRevenue.toLocaleString()}</p>
              <p style={{ color: '#22c55e', fontWeight: 600, marginTop: 8 }}>Total platform revenue</p>
            </div>
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow)' }}>
              <h4 style={{ marginBottom: 16 }}>Events Report</h4>
              <p style={{ marginBottom: 8 }}>Total Events: <strong>{events.length}</strong></p>
              <p style={{ marginBottom: 8 }}>Free Events: <strong>{events.filter(e => e.price === 0).length}</strong></p>
              <p style={{ marginBottom: 8 }}>Paid Events: <strong>{events.filter(e => e.price > 0).length}</strong></p>
            </div>
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow)' }}>
              <h4 style={{ marginBottom: 16 }}>Users Report</h4>
              <p style={{ marginBottom: 8 }}>Total Users: <strong>{stats.totalUsers}</strong></p>
              <p style={{ marginBottom: 8 }}>Organizers: <strong>{stats.totalOrganizers}</strong></p>
              <p style={{ marginBottom: 8 }}>Admins: <strong>{users.filter(u => u.role === 'admin').length}</strong></p>
            </div>
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow)' }}>
              <h4 style={{ marginBottom: 16 }}>Categories Report</h4>
              <p style={{ marginBottom: 8 }}>Total Categories: <strong>{categories.length}</strong></p>
              {categories.map((cat, i) => (
                <p key={i} style={{ marginBottom: 4, fontSize: 13 }}>{cat.icon} {cat.name}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;