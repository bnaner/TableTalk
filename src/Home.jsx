import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // Navigation handlers
  const goToHome = () => navigate('/home');
  const goToInventory = () => navigate('/inventory');
  const goToDiscussions = () => navigate('/discussions');
  const goToLogin = () => navigate('/login');

  return (
    <div style={styles.container}>
      {/* Navigation Bar */}
      <div style={styles.navbar}>
        <div style={styles.logo}>Table Talk</div>
        <div style={styles.navLinks}>
          <button onClick={goToHome} style={styles.navLink}>Home</button>
          <button onClick={goToInventory} style={styles.navLink}>Inventory</button>
          <button onClick={() => {}} style={styles.navLink}>Review</button>
          <button onClick={() => {}} style={styles.navLink}>About</button>
          <button onClick={() => {}} style={styles.navLink}>Create Event</button>
        </div>
      </div>
      
      {/* Main Content */}
      <div style={styles.content}>
        <h1 style={styles.heading}>This is the home page</h1>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2c2c44',
    padding: '15px 20px',
    color: 'white',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#FFD700', // Gold color for the logo
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '5px 10px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  content: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  heading: {
    fontSize: '32px',
    color: '#333',
    textAlign: 'center',
  }
};

export default Home;