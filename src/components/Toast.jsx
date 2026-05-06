import React from 'react';
import { useApp } from '../context/AppContext';
import './Toast.css';

const Toast = () => {
  const { notifications } = useApp();
  return (
    <div className="toast-container">
      {notifications.map(n => (
        <div key={n.id} className={`toast toast-${n.type}`}>
          <span className="toast-icon">
            {n.type === 'success' ? '✅' : n.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Toast;
