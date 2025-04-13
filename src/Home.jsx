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
        {/* About Section */}
        <div className="about-section">
          <h2>What's Table Talk?</h2>
          <p>
            Table Talk is a social website designed for Honors Tabletop members to connect, plan games, and share reviews. Members can pre-organize games before club hours to get started faster, and they can leave feedback on the club’s board games to help others find new favorites.
          </p>
        </div>

        {/* Team Section */}
        <div className="team-section">
          <h2>Meet the Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <img src="/JakeHeadshot.jpg" alt="Jake" />
              <p>Jake</p>
            </div>
            <div className="team-member">
              <img src="/LaythHeadshot.jpg" alt="Layth" />
              <p>Layth</p>
            </div>
            <div className="team-member">
              <img src="/MichaelHeadshot.jpg" alt="Michael" />
              <p>Michael</p>
            </div>
            <div className="team-member">
              <img src="/NagendraHeadshot.jpg" alt="Nagendra" />
              <p>Nagendra</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
