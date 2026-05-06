import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getEvents, createEvent, deleteEvent, updateEvent } from '../api';
import './OrganizerPage.css';


const OrganizerPage = () => {
  const { user, addNotification } = useApp();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
const [showCreateModal, setShowCreateModal] = useState(false);
const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({
    title: '', category: 'Technology', date: '', time: '',
    location: '', price: '', capacity: '', description: ''
  });

  useEffect(() => {
    if (!user || (user.role !== 'organizer' && user.role !== 'admin')) {
      navigate('/login');
      return;
    }
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        if (Array.isArray(data)) setEvents(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [user, navigate]);

  if (!user || (user.role !== 'organizer' && user.role !== 'admin')) return null;

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        const data = await updateEvent(editingEvent._id, {
          ...newEvent,
          price: Number(newEvent.price),
          capacity: Number(newEvent.capacity)
        });
        if (data._id) {
          setEvents(prev => prev.map(ev => ev._id === data._id ? data : ev));
          addNotification('Event updated successfully!', 'success');
        }
      } else {
        const data = await createEvent({
          ...newEvent,
          price: Number(newEvent.price),
          capacity: Number(newEvent.capacity)
        });
        if (data._id) {
          setEvents(prev => [...prev, data]);
          addNotification('Event created successfully!', 'success');
        }
      }
      setShowCreateModal(false);
      setEditingEvent(null);
      setNewEvent({ title: '', category: 'Technology', date: '', time: '', location: '', price: '', capacity: '', description: '' });
    } catch (error) {
      addNotification('Failed to save event', 'error');
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id);
      setEvents(prev => prev.filter(e => e._id !== id));
      addNotification('Event deleted!', 'success');
    } catch (error) {
      addNotification('Failed to delete event', 'error');
    }
  };

  return (
    <div className="page-wrapper organizer-page">
      <div className="container">
        <div className="organizer-header">
          <div>
            <h1 className="section-title">Organizer Panel</h1>
            <p className="section-subtitle">Manage your events</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            + Create New Event
          </button>
        </div>

        <div className="org-events-table">
          <div className="table-header">
            <span>Event</span>
            <span>Date</span>
            <span>Location</span>
            <span>Price</span>
            <span>Capacity</span>
            <span>Actions</span>
          </div>
          {loading ? (
            <p style={{ padding: 20 }}>Loading events...</p>
          ) : events.length === 0 ? (
            <p style={{ padding: 20 }}>No events yet. Create your first event!</p>
          ) : events.map(event => (
            <div key={event._id} className="table-row">
              <div className="table-event-cell">
                <div>
                  <p className="table-event-title">{event.title}</p>
                  <span className="badge badge-gold">{event.category}</span>
                </div>
              </div>
              <span>{new Date(event.date).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span>{event.location}</span>
              <span>{event.price === 0 ? 'FREE' : `AED ${event.price}`}</span>
              <span>{event.capacity}</span>
              <div className="table-actions">
               <button className="action-btn edit" onClick={() => { setEditingEvent(event); setNewEvent({ title: event.title, category: event.category, date: event.date ? new Date(event.date).toISOString().split('T')[0] : '', time: event.time || '', location: event.location, price: event.price, capacity: event.capacity, description: event.description || '' }); setShowCreateModal(true); }}>Edit</button>
<button className="action-btn delete" onClick={() => handleDeleteEvent(event._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>X</button>
            </div>
            <form className="modal-form" onSubmit={handleCreateEvent}>
              <div className="form-group">
                <label>Event Title *</label>
                <input required value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Enter event title" />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Category</label>
                  <select value={newEvent.category}
                    onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}>
                    {['Technology', 'Music', 'Business', 'Cultural', 'Health', 'Arts', 'Food', 'Sports'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (AED)</label>
                  <input type="number" min={0} value={newEvent.price}
                    onChange={e => setNewEvent({ ...newEvent, price: e.target.value })}
                    placeholder="0 for free" />
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Date *</label>
                  <input required type="date" value={newEvent.date}
                    onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Time *</label>
                  <input required type="time" value={newEvent.time}
                    onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input required value={newEvent.location}
                  onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Venue name, City" />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input type="number" min={1} value={newEvent.capacity}
                  onChange={e => setNewEvent({ ...newEvent, capacity: e.target.value })}
                  placeholder="Max attendees" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={newEvent.description}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Describe your event..." />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-dark"
                  onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerPage;