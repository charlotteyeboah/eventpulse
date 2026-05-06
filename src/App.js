import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Chatbot from './components/Chatbot';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import { CartPage, CheckoutPage, ConfirmationPage } from './pages/CartCheckout';
import { UserDashboard } from './pages/Dashboard';
import OrganizerPage from './pages/OrganizerPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import './index.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/bookings" element={<UserDashboard />} />
          <Route path="/organizer" element={<OrganizerPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={
            <div style={{ textAlign:'center', padding:'120px 24px', minHeight:'100vh' }}>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:64, color:'#0a0f2e' }}>404</h1>
              <p style={{ fontSize:18, color:'#4b5563', margin:'12px 0 24px' }}>Page not found</p>
              <a href="/" style={{ background:'#f0a500', color:'#0a0f2e', padding:'12px 28px', borderRadius:50, fontWeight:700, textDecoration:'none' }}>← Go Home</a>
            </div>
          } />
        </Routes>
        <Footer />
        <Toast />
        <Chatbot />
      </Router>
    </AppProvider>
  );
}

export default App;
