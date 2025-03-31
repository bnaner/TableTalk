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
    )
}

export default Inventory;