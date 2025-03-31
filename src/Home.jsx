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

export default Home;