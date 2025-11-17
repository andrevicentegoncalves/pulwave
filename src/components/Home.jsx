// src/components/Home.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Badge from './Badge';
import Alert from './Alert';
import Card from './Card';

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSignOut = async () => await supabase.auth.signOut();

  const BadgeRow = ({ variant }) => (
    <div className="badge-row">
      <Badge variant={variant} type="info">Badge label</Badge>
      <Badge variant={variant} type="success">Badge label</Badge>
      <Badge variant={variant} type="warning">Badge label</Badge>
      <Badge variant={variant} type="error">Badge label</Badge>
      <Badge variant={variant} type="neutral">Badge label</Badge>
    </div>
  );

  const ButtonRow = ({ variant }) => (
    <div className="button-row">
      <button className={`btn ${variant ? `btn--${variant}` : ''}`}>
        {variant || 'Default'} M
      </button>
      <button className={`btn btn--s ${variant ? `btn--${variant}` : ''}`}>
        {variant || 'Default'} S
      </button>
      <button className={`btn btn--l ${variant ? `btn--${variant}` : ''}`}>
        {variant || 'Default'} L
      </button>
      <button disabled className={`btn ${variant ? `btn--${variant}` : ''}`}>
        {variant || 'Default'} Disabled
      </button>
    </div>
  );

  return (
    <div className="home-container">

    <Card header={<strong>User Information Overview</strong>}>
        <section className="user-info">
          {/* ... existing user info items ... */}
        </section>
      </Card>

      {/* USER INFO */}
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
          <span className="user-info__label">X Handle:</span>
          <a href="https://x.com/Cryptothraki" target="_blank" rel="noopener" className="user-info__link">
            @Cryptothraki
          </a>
        </div>
        <div className="user-info__item">
          <span className="user-info__label">Country:</span>
          <span className="user-info__value">pt</span>
        </div>
      </section>

      <hr className="divider" />
      
      {/* ALERT SHOWCASE (New section added) */}
      <section className="alert-showcase">
        <h2>Alert Messages</h2>
        <Alert type="info">This is an informational message for the user.</Alert>
        <Alert type="success">Action successful! Your data has been saved.</Alert>
        <Alert type="warning">Warning: Proceed with caution.</Alert>
        <Alert type="error">Error: Something went wrong.</Alert>
      </section>

      <hr className="divider" />

      {/* BUTTON SHOWCASE */}
      <section className="button-showcase">
        <h2>Button Variants & Sizes</h2>
        <ButtonRow variant="primary" />
        <ButtonRow variant="secondary" />
        <ButtonRow variant="tertiary" />
        <ButtonRow variant="destructive" />
        <ButtonRow variant="ghost" />
      </section>
      

      <hr className="divider" />

      {/* FULL 15-VARIANT SHOWCASE */}
      <section className="badge-showcase">
        <h2>Badge Variants</h2>

        <div className="variant-group">
          <h3>Heavy</h3>
          <BadgeRow variant="heavy" />
        </div>

        <div className="variant-group">
          <h3>Medium</h3>
          <BadgeRow variant="medium" />
        </div>

        <div className="variant-group">
          <h3>Light</h3>
          <BadgeRow variant="light" />
        </div>
      </section>
      

      <button onClick={handleSignOut} className="sign-out-btn">
        Sign Out
      </button>
    </div>
  );
}
