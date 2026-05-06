import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { CATEGORIES } from '../data/mockData';
import { getEvents } from '../api';
import './EventsPage.css';

const EventsPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [search, setSearch] = useState(params.get('q') || '');
  const [selectedCat, setSelectedCat] = useState(params.get('cat') || 'All');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        if (Array.isArray(data)) {
          setEvents(data);
          setFiltered(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    let result = [...events];
    if (search) result = result.filter(e =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
    );
    if (selectedCat !== 'All') result = result.filter(e => e.category === selectedCat);
    if (priceFilter === 'free') result = result.filter(e => e.price === 0);
    if (priceFilter === 'paid') result = result.filter(e => e.price > 0);
    if (priceFilter === 'under100') result = result.filter(e => e.price > 0 && e.price < 100);
    if (sortBy === 'price') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    setFiltered(result);
  }, [search, selectedCat, priceFilter, sortBy, events]);

  return (
    <div className="page-wrapper events-page">
      <div className="events-hero">
        <div className="container">
          <h1 className="section-title" style={{ color: 'white' }}>Explore Events</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>Discover amazing events across the UAE</p>
          <div className="events-searchbar">
            <span>🔍</span>
            <input type="text" placeholder="Search by name, venue, or tag..."
              value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch('')} className="clear-search">X</button>}
          </div>
        </div>
      </div>

      <div className="container events-layout">
        <aside className="events-sidebar">
          <div className="filter-group">
            <h4>Categories</h4>
            {['All', ...CATEGORIES.map(c => c.name)].map(cat => (
              <button key={cat} className={`filter-btn ${selectedCat === cat ? 'active' : ''}`}
                onClick={() => setSelectedCat(cat)}>
                {cat !== 'All' && CATEGORIES.find(c => c.name === cat)?.icon} {cat}
              </button>
            ))}
          </div>
          <div className="filter-group">
            <h4>Price Range</h4>
            {[
              { value: 'all', label: 'All Prices' },
              { value: 'free', label: 'Free Events' },
              { value: 'under100', label: 'Under AED 100' },
              { value: 'paid', label: 'Paid Events' },
            ].map(p => (
              <button key={p.value} className={`filter-btn ${priceFilter === p.value ? 'active' : ''}`}
                onClick={() => setPriceFilter(p.value)}>{p.label}</button>
            ))}
          </div>
          <div className="filter-group">
            <h4>Sort By</h4>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="filter-select">
              <option value="date">Date (Upcoming)</option>
              <option value="price">Price (Low to High)</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          <button className="btn btn-dark w-full" onClick={() => { setSearch(''); setSelectedCat('All'); setPriceFilter('all'); setSortBy('date'); }}>
            Reset Filters
          </button>
        </aside>

        <div className="events-main">
          <div className="events-toolbar">
            <p className="results-count">
              Showing <strong>{filtered.length}</strong> events
              {selectedCat !== 'All' && ` in "${selectedCat}"`}
            </p>
            <div className="view-toggle">
              <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>Grid</button>
              <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>List</button>
            </div>
          </div>

          {loading ? (
            <div className="no-events">
              <span>Loading events...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="no-events">
              <span>No events found</span>
              <button className="btn btn-primary" onClick={() => { setSearch(''); setSelectedCat('All'); setPriceFilter('all'); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid-3' : 'events-list'}>
              {filtered.map(event => (
                <EventCard key={event._id ? event._id : event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;