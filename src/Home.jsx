import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import './styles.css'

const Home = () => {
  return (
    <div class="container">
      <Navbar /> 
      {/* Main Content */}
      <div class="content">
        <h1 class="heading">This is the Home page!</h1>
      </div>
    </div>
  );
};

/*const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#FFD700', // Gold color for the logo
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
*/

export default Home;