import {useState, useEffect} from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Home';
import Inventory from "./Inventory";
import Discussions from "./Discussions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/inventory" element={<Inventory />}></Route>
        <Route path="/discussions" element={<Discussions />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
