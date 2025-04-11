
import React, { useState } from "react";

const Inventory = () => {
  // State for modal visibility
  const [showModal, setShowModal] = useState(false);
  
  // State for form inputs
  const [gameName, setGameName] = useState('');
  const [gameGenre, setGameGenre] = useState('');
  
  // State for games list (initially empty)
  const [games, setGames] = useState([]);

  // Handle opening 
  const openNewGameModal = () => {
    setShowModal(true);
  };

  // Handle closing 
  const closeModal = () => {
    setShowModal(false);
    // Reset form fields when closing
    setGameName('');
    setGameGenre('');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new game object
    const newGame = {
      id: Date.now(), // Use timestamp as unique id (might delete and add names as ID to include multiple)
      name: gameName,
      genre: gameGenre
    };
    
    // Add the new game to the games array
    setGames([...games, newGame]);
    closeModal();
  };

  return (
    <div style={styles.inventoryPage}>
      {/* Top navigation */}
      <div style={styles.navbar}>
        <div style={styles.navbarContainer}>
          <div style={styles.logo}>
            <h1 style={styles.logoText}>Table Talk</h1>
          </div>
          <div style={styles.navLinks}>
            <a href="#home" style={styles.navLink}>Home</a>
            <a href="#inventory" style={{...styles.navLink, ...styles.activeNavLink}}>Inventory</a>
            <a href="#review" style={styles.navLink}>Review</a>
            <a href="#about" style={styles.navLink}>About</a>
            <a href="#create-event" style={styles.navLink}>Create Event</a>
          </div>
        </div>
      </div>
      
      <div style={styles.contentContainer}>
        {/* Left sidebar */}
        <div style={styles.sidebar}>
          {/* Blue sidebar */}
=======
import React from "react";
import Navbar from './Components/Navbar';


function Inventory() {
    return ( 
        <div class="container">
            <Navbar />
            {/* Main Content */}
            <div class="content">
                <h1 class="heading">This is the Inventory page!</h1>
            </div>
        </div>

        {/* Main content */}
        <div style={styles.mainContent}>
          <div style={styles.inventoryHeader}>
            <h2 style={styles.inventoryHeading}>Boardgame Inventory</h2>
            <button 
              style={styles.newGameBtn}
              onClick={openNewGameModal}
            >
              + New Game
            </button>
          </div>
          
          <div style={styles.searchContainer}>
            <div style={styles.searchBox}>
              <span style={styles.searchIcon}>🔍</span>
              <input 
                type="text" 
                placeholder="Search" 
                style={styles.searchInput}
              />
            </div>
          </div>
          
          <div style={styles.inventoryList}>
            {games.length > 0 ? (
              games.map(game => (
                <div key={game.id} style={styles.gameCard}>
                  <div style={styles.gameName}>{game.name}</div>
                  <div style={styles.gameGenre}>{game.genre}</div>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>No games in your inventory yet.</div>
            )}
          </div>
        </div>
      </div>
      
      {/* New Game Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Add New Game</h3>
              <button 
                style={styles.closeButton}
                onClick={closeModal}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label htmlFor="game-name" style={styles.label}>Game Name</label>
                <input
                  id="game-name"
                  type="text"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  style={styles.input}
                  placeholder="Enter game name"
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label htmlFor="game-genre" style={styles.label}>Genre</label>
                <input
                  id="game-genre"
                  type="text"
                  value={gameGenre}
                  onChange={(e) => setGameGenre(e.target.value)}
                  style={styles.input}
                  placeholder="Enter game genre"
                  required
                />
              </div>
              
              <div style={styles.modalFooter}>
                <button 
                  type="button" 
                  style={styles.cancelButton}
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={styles.submitButton}
                >
                  Add Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// All styles as a JavaScript object
const styles = {
  inventoryPage: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f8f8f8',
    fontFamily: 'Arial, sans-serif',
  },
  
  // Navigation bar
  navbar: {
    width: '100%',
    backgroundColor: '#1a1a2e', // Dark navy color for the navigation bar
    padding: 0,
  },
  navbarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '12px 20px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    color: '#ffd700', // Golden yellow color for the logo
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    margin: '0 4px',
    fontSize: '16px',
    position: 'relative',
  },
  activeNavLink: {
    fontWeight: 'bold',
    position: 'relative',
    ':after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '3px',
      backgroundColor: '#ffd700', // Golden yellow underline
    },
    borderBottom: '3px solid #ffd700', 
  },
  
  // Main content layout
  contentContainer: {
    display: 'flex',
    height: 'calc(100vh - 60px)', // Total height minus navbar height
  },
  
  // Sidebar
  sidebar: {
    width: '70px',
    backgroundColor: '#1a1a2e',
    height: '100%',
  },
  
  mainContent: {
    flex: 1,
    padding: '20px',
    backgroundColor: 'white',
    height: '100%',
    overflowY: 'auto',
  },
  inventoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  inventoryHeading: {
    color: '#1a1a2e', 
    fontSize: '24px',
    fontWeight: 'normal',
    margin: 0,
  },
  newGameBtn: {
    backgroundColor: '#1a1a2e', 
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
  },
  
  // Search area
  searchContainer: {
    marginBottom: '20px',
    borderBottom: '1px solid #eaeaea',
    paddingBottom: '20px',
  },
  searchBox: {
    position: 'relative',
    maxWidth: '300px',
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#999',
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    paddingLeft: '35px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  
  // Inventory list area
  inventoryList: {
    minHeight: '300px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    padding: '10px 0',
  },
  gameCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-5px)',
    },
  },
  gameName: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#1a1a2e',
  },
  gameGenre: {
    fontSize: '14px',
    color: '#666',
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '40px 0',
    color: '#999',
    fontSize: '16px',
  },
  
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid #eaeaea',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    margin: 0,
    fontSize: '20px',
    color: '#1a1a2e',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#999',
  },
  modalForm: {
    padding: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#666',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  submitButton: {
    padding: '8px 16px',
    backgroundColor: '#1a1a2e',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  }
};

export default Inventory;