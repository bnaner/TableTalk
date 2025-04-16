import React, { useState } from "react";
import Navbar from "./Components/Navbar";
import "./styles.css";

const GroupPage = () => {
  const username = "testUser";
  
  // State for the input (group name), the master list of groups, and the user's joined groups.
  const [groupName, setGroupName] = useState("");
  const [allGroups, setAllGroups] = useState([]);   // All created groups
  const [yourGroups, setYourGroups] = useState([]);   // Groups that the user has joined

  // Creates a new group if it doesn't exist yet.
  const handleCreateGroup = () => {
    const name = groupName.trim();
    if (!name || allGroups.includes(name)) return;
    setAllGroups(prev => [...prev, name]);
    setGroupName("");
  };

  // Joins an existing group, adding it only if it exists and hasn't been joined yet.
  const handleJoinGroup = () => {
    const name = groupName.trim();
    if (!name || !allGroups.includes(name)) return; // Only join existing groups
    if (!yourGroups.includes(name)) {
      setYourGroups(prev => [...prev, name]);
    }
    setGroupName("");
  };

  // Leaves a group by removing it from the user's joined groups.
  const handleLeaveGroup = () => {
    const name = groupName.trim();
    if (!name) return;
    setYourGroups(prev => prev.filter(g => g !== name));
    setGroupName("");
  };

  return (
    <div className="container">
      <Navbar />
      <div className="content">
        <h1 className="heading">Groups</h1>
        <div className="group-section">
          <div className="group-button-container">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />
            <button className="groupBtn" onClick={handleCreateGroup}>
              Create Group
            </button>
            <button className="groupBtn" onClick={handleJoinGroup}>
              Join Group
            </button>
            <button className="groupBtn" onClick={handleLeaveGroup}>
              Leave Group
            </button>
          </div>

          <div className="group-list">
            <h3>All Groups:</h3>
            <ul>
              {allGroups.map((group, index) => (
                <li key={index}>{group}</li>
              ))}
            </ul>

            <h3>Your Groups:</h3>
            <ul>
              {yourGroups.map((group, index) => (
                <li key={index}>{group}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
