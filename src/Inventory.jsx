import React, { useState } from "react";
import { useEffect } from "react";
import Navbar from "./Components/Navbar.jsx";
import './styles.css'

const Inventory = () => {
  // State for modal visibility (model is the create game popup)
  const [showModal, setShowModal] = useState(false);
  
  // State for form inputs
  const [gameName, setGameName] = useState('');
  const [gameGenre, setGameGenre] = useState('');
  const [gameImage, setGameImage] = useState('');
  const [gameDescription, setGameDescription] = useState('');
  const [gameRating, setGameRating] = useState('');
  const [gameConstraint, setGameConstraint] = useState(new RegExp(''));

  
  // State for games list (initially empty)
  const [games, setGames] = useState([]);

  // Handle opening and closing
  const openNewGameModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    // Reset form fields when closing
    setGameName('');
    setGameGenre('');
    setGameImage('');
    setGameDescription('');
    setGameRating('');
  };

  useEffect(() => {
    fetch('/findGame')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        return response.json();
      })
      .then(data => {
        setGames(data); // Populate the games state with data from the backend
      })
      .catch(error => {
        console.error('Error fetching games:', error);
        alert('Failed to load games. Please try again.');
      });
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new game object
    const newGame = {
      image: gameImage,
      name: gameName,
      genre: gameGenre,
      rating: gameRating,
      description: gameDescription,
      comments: []
    };


    fetch('/insertGame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGame),
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(text || 'Failed to insert game');
          });
        }
        return response.text();
      })

      .then(data => {
        console.log('Game inserted successfully:', data);
        // Add the new game to the games array
        setGames([...games, newGame]);
        closeModal();
      })
      .catch((error) => {
        console.error('Error inserting game:', error);
        alert('Failed to insert game. Please try again.');
      })
  };

  const handleDelete = (e, selected) => {
    e.preventDefault();

    const selectedGame = {name: selected};
    fetch('/deleteGame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedGame),
    }).then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(text || 'Failed to delete game');
        });
      }
      return response.text();
    })
    .then(data => {
      console.log('Game deleted successfully:', data);
      // Remove game from games array
      setGames(games.filter(game => game.name !== selected));
    })
    .catch((error) => {
      console.error('Error deleting game:', error);
      alert('Failed to delete game.');
    })
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (e.key === 'Enter'){
      const search = document.getElementById("searchBar").value;
      setGameConstraint(RegExp(search, 'i'));
    }
  }

  return (
    <div className="container">
      {/* Use the Navbar component */}
      <Navbar activePage="inventory" />
      
      {/* Main content - Removed sidebar */}
      <div style={styles.mainContentWrapper}>
        <div style={styles.mainContent}>
          <div style={styles.inventoryHeader}>
            <h2 style={styles.inventoryHeading}>Honors Tabletop Inventory</h2>
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
                id="searchBar"
                type="text" 
                placeholder="Search" 
                style={styles.searchInput}
                onKeyUp={handleSearch}
              />
            </div>
          </div>
          
          <div style={styles.inventoryList}>
            {games.length > 0 ? (
              games.filter(game => gameConstraint.test(game.name)).map(game => (
                <div key={game.name} style={styles.gameCard}>
                  <img style={styles.gameImage} src={game.image} alt={game.name} />
                  <div style={styles.gameName}>{game.name}
                    <span style={styles.gameRating}>
                    {game.rating} / 10
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Black_Star.svg" style={styles.gameStar} alt='a star'/>
                    </span>
                  </div>
                  <div style={styles.gameGenre}>{game.genre}</div>
                  <br />
                  <div style={styles.gameDescription}>{game.description}</div>
                  <button style={styles.gameDelete} onClick={(e) => handleDelete(e, game.name)}>- Delete Game</button>
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
              <div style={styles.formGroup}>
                <label htmlFor="game-image" style={styles.label}>Image</label>
                <input
                  id="game-image"
                  type="text"
                  value={gameImage}
                  onChange={(e) => setGameImage(e.target.value)}
                  style={styles.input}
                  placeholder="Enter image url"
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="game-description" style={styles.label}>Description</label>
                <input
                  id="game-description"
                  type="text"
                  value={gameDescription}
                  onChange={(e) => setGameDescription(e.target.value)}
                  style={styles.input}
                  placeholder="Enter game description"
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
  mainContentWrapper: {
    width: '100%',
    padding: '0',
  },
  
  mainContent: {
    padding: '20px',
    backgroundColor: 'white',
    minHeight: 'calc(100vh - 60px)', // Total height minus navbar height
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
    width: '250px',
    height: '350px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '16px',
    position: 'relative',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-5px)',
    },
  },
  gameImage:{
    maxWidth: '100%',
    maxHeight: '200px',
    borderRadius: '8px',
    display: 'block',
    margin: 'auto',
  },
  gameName: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#1a1a2e',
  },
  gameRating: {
    fontSize: '14px',
    float: 'right',
    textIndent: '2px',
  },
  gameStar: {
    height: '12px',
    width: '12px',
  },
  gameGenre: {
    fontSize: '14px',
    color: '#666',
  },
  gameDescription: {
    fontSize: '12px',
    color: '#666',
  },
  gameDelete: {
    float: 'right',
    fontSize: '14px',
    backgroundColor: '#1a1a2e', 
    color: 'white',
    border: 'none',
    padding: '3px 6px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'right',
    position: 'absolute',
    right: '8px',
    bottom: '8px',
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