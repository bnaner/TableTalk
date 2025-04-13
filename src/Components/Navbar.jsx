import React from "react";
import { useNavigate } from 'react-router-dom';


function Navbar() {
    // Navigation handlers
    const navigate = useNavigate();
    const goToHome = () => navigate('/home');
    const goToInventory = () => navigate('/inventory');
    const goToDiscussions = () => navigate('/discussions');
    const goToGroups = () => navigate('/groups');
    const goToLogin = () => navigate('/login');
    return (
    <div>
      {/* Navigation Bar */}
      <div style={styles.navbar}>
        <div style={styles.logo}>Table Talk</div>
        <div style={styles.navLinks}>
          <button onClick={goToHome} style={styles.navLink}>Home</button>
          <button onClick={goToInventory} style={styles.navLink}>Inventory</button>
          <button onClick={goToDiscussions} style={styles.navLink}>Discussions</button>
          <button onClick={goToGroups} style={styles.navLink}>Groups</button>
          <button onClick={() => {}} style={styles.navLink}>About</button>
          <button onClick={() => {}} style={styles.navLink}>Create Event</button>
          <button onClick={goToLogin} style={styles.navLink}>Logout</button>
        </div>
      </div>
    </div>
    )
}

const styles = {
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
    }
  };

export default Navbar;
