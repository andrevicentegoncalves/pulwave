// src/components/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Card from './Card';
import Badge from './Badge';

export default function Home() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSignOut = async () => await supabase.auth.signOut();

  return (
    <div className="home-container">
      {/* HEADER */}
      <header className="home-header">
        <h1>Welcome to Pulwave</h1>
        <p className="home-subtitle">
          A modern React application with Supabase authentication
        </p>
      </header>

      {/* MAIN CONTENT */}
      <div className="home-content">
        <Card header={<strong>Dashboard Overview</strong>}>
          <section className="user-info">
            <div className="user-info__item">
              <span className="user-info__label">Current time:</span>
              <span className="user-info__value">
                {currentTime.toLocaleString('en-GB', {
                  timeZone: 'Europe/Lisbon',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}{' '}
                WET
              </span>
            </div>
            <div className="user-info__item">
              <span className="user-info__label">Status:</span>
              <Badge variant="heavy" type="success">Active</Badge>
            </div>
            <div className="user-info__item">
              <span className="user-info__label">Location:</span>
              <span className="user-info__value">Lisbon, Portugal</span>
            </div>
            <div className="user-info__item">
              <span className="user-info__label">X Handle:</span>
              <a 
                href="https://x.com/Cryptothraki" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="user-info__link"
              >
                @Cryptothraki
              </a>
            </div>
          </section>
        </Card>

        <Card header={<strong>Quick Actions</strong>}>
          <div className="quick-actions">
            <button 
              className="btn btn--primary btn--l"
              onClick={() => navigate('/style-guide')}
            >
              📚 View Style Guide
            </button>
            <p style={{ 
              marginTop: 'var(--scale-3)', 
              fontSize: 'var(--font-size-body-s)',
              color: 'var(--color-on-surface-subtle)'
            }}>
              Explore all UI components with interactive examples
            </p>
          </div>
        </Card>

        <Card>
          <h3>Getting Started</h3>
          <p>Welcome to your Pulwave dashboard! This application features:</p>
          <ul style={{ 
            marginLeft: 'var(--scale-5)', 
            marginTop: 'var(--scale-3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--scale-2)'
          }}>
            <li>🔐 Secure authentication with Supabase</li>
            <li>🎨 Complete UI component library</li>
            <li>📱 Mobile-first responsive design</li>
            <li>♿ Built-in accessibility features</li>
            <li>🎯 Design token system for consistency</li>
          </ul>
        </Card>
      </div>

      {/* FOOTER */}
      <footer className="home-footer">
        <button 
          onClick={handleSignOut} 
          className="btn btn--destructive"
        >
          Sign Out
        </button>
      </footer>
    </div>
  );
}