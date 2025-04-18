import React, { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import "./styles.css";

const GroupPage = () => {
  // State for the input (group name), the master list of groups, and the user's joined groups.
  const [username, setUsername] = useState(""); // State to store the username  
  const [groupName, setGroupName] = useState("");
  const [allGroups, setAllGroups] = useState([]);   // All created groups
  const [yourGroups, setYourGroups] = useState([]);   // Groups that the user has joined

  //gets the username from the /profile command
  useEffect(() => {
    fetch('/profile')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        return response.text(); // Assuming the backend returns the username as plain text
      })
      .then(data => {
        setUsername(data); // Set the username in state
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
        alert('Failed to load user profile. Please try again.');
      });
  }, []);

  useEffect(() => {
    fetch('/getAllGroups')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch all groups');
        }
        return response.json();
      })
      .then(data => {
        setAllGroups(data.map(group => group.name)); // Extract group names
      })
      .catch(error => {
        console.error('Error fetching all groups:', error);
        alert('Failed to load all groups. Please try again.');
      });
  }, []);

  useEffect(() => {
    if (username) { // Ensure username is loaded before making the request
      fetch(`/getUserGroups?user=${username}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch user groups');
          }
          return response.json();
        })
        .then(data => {
          setYourGroups(data.map(group => group.name)); // Extract group names
        })
        .catch(error => {
          console.error('Error fetching user groups:', error);
          alert('Failed to load your groups. Please try again.');
        });
    }
  }, [username]); // Run this effect when the username changes


  // Creates a new group if it doesn't exist yet.
  const handleCreateGroup = () => {
    const name = groupName.trim();
    if (!name || allGroups.includes(name)) return;

    fetch('/CreateGroup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, people: username }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create group');
        }
        return response.text();
      })
      .then(() => {
        setAllGroups(prev => [...prev, name]); // Add the new group to allGroups
        setYourGroups(prev => [...prev, name]); // Add the new group to yourGroups
        setGroupName(""); // Clear the input field
      })
      .catch(error => {
        console.error('Error creating group:', error);
        alert('Failed to create group. Please try again.');
      });
  };

  // Joins an existing group, adding it only if it exists and hasn't been joined yet.
  const handleJoinGroup = () => {
    const name = groupName.trim();
    if (!name || !allGroups.includes(name) || yourGroups.includes(name)) return;

    fetch('/updateGroupPeople', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, newPeople: username }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to join group');
        }
        return response.text();
      })
      .then(() => {
        setYourGroups(prev => [...prev, name]); // Add the group to yourGroups
        setGroupName(""); // Clear the input field
      })
      .catch(error => {
        console.error('Error joining group:', error);
        alert('Failed to join group. Please try again.');
      });
  };

  // Leaves a group by removing it from the user's joined groups.
const handleLeaveGroup = () => {
  const name = groupName.trim();
  if (!name || !yourGroups.includes(name)) return;

  fetch('/removeUserFromGroup', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, user: username }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to leave group');
      }
      return response.text();
    })
    .then(() => {
      setYourGroups(prev => prev.filter(g => g !== name)); // Remove the group from yourGroups
      setGroupName(""); // Clear the input field
    })
    .catch(error => {
      console.error('Error leaving group:', error);
      alert('Failed to leave group. Please try again.');
    });
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
