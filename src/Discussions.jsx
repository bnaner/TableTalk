import React from "react";
import Navbar from './Components/Navbar';
import './styles.css'

function Discussions() {
    return (
        <div class="container">
            <Navbar />
            {/* Main Content */}
            <div class="content">
                <h1 class="heading">This is the Discussions page!</h1>
            </div>
        </div>
    )
}

export default Discussions;