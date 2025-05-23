const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const app = express();
const port = 5000;

const uri = "mongodb+srv://Admin1:pass98@tabletalk-mongo.vh4ln.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


let database;

app.use(express.json());

const session = require('express-session');

app.use(session({
    secret: '9b1c2f3e4d5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.post('/insert', async (req, res) => {
    const { name, email, profileMessage, groups, password } = req.body;
    try {
        const collection = database.collection('users');
        const hashedPassword = await bcrypt.hash(password, 10); //encrypt password for 10 rounds, more rounds = more secure
        const doc = { name, email, profileMessage, groups, password: hashedPassword }; //create document
        await collection.insertOne(doc); //db commant to insert document
        res.status(200).send('Document inserted successfully.');
    } catch (e) {
        res.status(500).send(`Insert failed: ${e.message}`);
    }
});

app.put('/update', async (req, res) => {
    const { name, newEmail, newProfileMessage, newGroups, newPassword } = req.body;
    try {
        const collection = database.collection('users'); //get collection
        const filter = { name }; //filter by name
        const hashedPassword = await bcrypt.hash(newPassword, 10); //encrypt new password
        const updateDoc = {
            $set: { //set new values
                email: newEmail,
                profileMessage: newProfileMessage,
                groups: newGroups,
                password: hashedPassword
            }
        };
        await collection.updateOne(filter, updateDoc); //db command to update document, requires a filter to find then updates doc
        res.status(200).send('Document updated successfully.');
    } catch (e) {
        res.status(500).send(`Update failed: ${e.message}`);
    }
});

app.delete('/delete', async (req, res) => {
    const { name } = req.body;
    try {
        const collection = database.collection('users');
        const filter = { name };
        await collection.deleteOne(filter); //delete document
        res.status(200).send('Document deleted successfully.');
    } catch (e) {
        res.status(500).send(`Delete failed: ${e.message}`);
    }
});

app.get('/find', async (req, res) => {
    const { name } = req.query; //filter by name
    try {
        const collection = database.collection('users');
        const filter = { name };
        const result = await collection.findOne(filter); //find one document and return as json
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).send('No matching document found.');
        }
    } catch (e) {
        res.status(500).send(`Find failed: ${e.message}`);
    }
});

app.get('/findAll', async (req, res) => {
    try {
        const collection = database.collection('users');
        const cursor = await collection.find({}).toArray(); //find all documents and return as array
        res.status(200).json(cursor);
    } catch (e) {
        res.status(500).send(`Find all failed: ${e.message}`);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password }); //line here is for debugging, prints email and password to console
    try {
      const collection = database.collection('users');
      const user = await collection.findOne({ email }); //finds user by email
      if (user) { //if user exists
        const passwordMatch = await bcrypt.compare(password, user.password); //compare password to hashed password
        console.log('Password match:', passwordMatch);
        if (passwordMatch) {
          req.session.userEmail = email; // Store email in session
          res.status(200).send('Login successful.');
        } else {
          res.status(401).send('Invalid email or password.');
        }
      } else {
        res.status(401).send('Invalid email or password.');
      }
    } catch (e) {
      res.status(500).send(`Login failed: ${e.message}`);
    }
});

app.get('/profile', (req, res) => {
    if (req.session.userEmail) {
        res.status(200).send(req.session.userEmail); // Return only the email
    } else {
        res.status(401).send('Not logged in.');
    }
});

app.post('/insertGame', async (req, res) => {
    const { name, rating, description, comments, genre, image } = req.body; 
    try {
        const collection = database.collection('games');
        const existingGame = await collection.findOne({ name });
        if (existingGame) {
            return res.status(400).send('Game with this name already exists.');
        }
        const doc = { 
            name, 
            rating: [rating], 
            description, 
            comments: [comments], 
            genre,
            image 
        };
        await collection.insertOne(doc);
        res.status(200).send('Game inserted successfully.');
    } catch (e) {
        res.status(500).send(`Insert game failed: ${e.message}`);
    }
});

app.post('/deleteGame', async (req, res) => {
    const {name} = req.body;
    try{
        const collection = database.collection('games');
        const existingGame = await collection.findOne({name});
        if (existingGame){
            await collection.deleteOne({name});
            res.status(200).send('Game deleted successfully.');
        }
        else{
            return res.status(400).send("Game with this name doesn't exist");
        }
    }
    catch{
        res.status(500).send(`Delete game failed: ${e.message}`);
    }
});

app.get('/findGame', async (req, res) => {
    try {
        const collection = database.collection('games');
        const games = await collection.find({}).toArray(); // Retrieve all games from the 'games' collection

        const gamesWithAverageRating = games.map(game => {
            const ratings = game.rating || []; // Use the 'rating' array or an empty array if undefined
            const averageRating = ratings.length > 0
                ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length // Calculate the average rating
                : 0; // Default to 0 if there are no ratings
            return { ...game, averageRating }; // Return the game object with an added 'averageRating' field
        });

        res.status(200).json(gamesWithAverageRating); // Send the games with average ratings as a JSON response
    } catch (e) {
        res.status(500).send(`Find game failed: ${e.message}`); // Handle errors and send a 500 status
    }
});

//this would return something like 
//[
//    {
//    "name": "Chess",
//    "rating": [5, 4, 3],
//    "description": "A classic strategy game.",
//    "comments": ["Great game!", "Timeless classic."],
//    "genre": "Strategy",
//    "averageRating": 4
//    }
//]

app.post('/CreateGroup', async (req, res) => {
    const { name, people } = req.body; //takes in name, and people in it
    try {
        const collection = database.collection('groups'); //get collection
        const doc = { 
            name, 
            people: [people] //same here
        };
        await collection.insertOne(doc);
        res.status(200).send('Group created successfully.');
    } catch (e) {
        res.status(500).send(`Create group failed: ${e.message}`);
    }
});

app.get('/getAllGroups', async (req, res) => {
    try {
        const collection = database.collection('groups');
        const groups = await collection.find({}).toArray(); 
        res.status(200).json(groups); 
    } catch (e) {
        res.status(500).send(`Failed to fetch all groups: ${e.message}`);
    }
});

app.get('/getUserGroups', async (req, res) => {
    const { user } = req.query; 
    try {
        const collection = database.collection('groups'); 
        const userGroups = await collection.find({ people: user }).toArray(); 
        res.status(200).json(userGroups); 
    } catch (e) {
        res.status(500).send(`Failed to fetch user groups: ${e.message}`);
    }
});

app.put('/removeUserFromGroup', async (req, res) => {
    const { name, user } = req.body; // Group name and the user to remove
    try {
        const collection = database.collection('groups'); // Get the groups collection
        const filter = { name }; // Find the group by name
        const updateDoc = {
            $pull: { people: user }, // Remove the user from the 'people' array
        };
        const result = await collection.updateOne(filter, updateDoc); // Update the group
        if (result.modifiedCount === 0) {
            return res.status(404).send('Group not found or user not in group.');
        }
        res.status(200).send('User removed from group successfully.');
    } catch (e) {
        res.status(500).send(`Failed to remove user from group: ${e.message}`);
    }
});

app.put('/updateGroupPeople', async (req, res) => {
    const {name, newPeople} = req.body;
    try {
        const collection = database.collection('groups');
        const filter = { name };
        const updateDoc = {
            $push: {
                people: newPeople, //push rating into array
            }
        };
        await collection.updateOne(filter, updateDoc);
        res.status(200).send('Game updated successfully.');
    } catch (e) {
        res.status(500).send(`Update game failed: ${e.message}`);
    }
});

app.put('/updateGameRating', async (req, res) => {
    const {name, newRating} = req.body;
    try {
        const collection = database.collection('games');
        const filter = { name };
        const updateDoc = {
            $push: {
                rating: newRating, //push rating into array
            }
        };
        await collection.updateOne(filter, updateDoc);
        res.status(200).send('Game updated successfully.');
    } catch (e) {
        res.status(500).send(`Update game failed: ${e.message}`);
    }
});

app.put('/updateGameComments', async (req, res) => {
    const {name, newComment} = req.body;
    try {
        const collection = database.collection('games');
        const filter = { name };
        const updateDoc = {
            $push: {
                comments: newComment // push comment into array
            }
        };
        await collection.updateOne(filter, updateDoc);
        res.status(200).send('Game updated successfully.');
    } catch (e) {
        res.status(500).send(`Update game failed: ${e.message}`);
    }
});

app.post('/createDiscussion', async (req, res) => {
    const { title, description, posterName } = req.body;
    try {
        const collection = database.collection('discussions'); 
        const doc = {
            title,
            description,
            posterName,
            comments: [], // Initialize with an empty comments array
            createdAt: new Date(), // Add a timestamp
        };
        await collection.insertOne(doc); // Save the discussion to the database
        res.status(200).json({ message: 'Discussion created successfully.' });    } 
        catch (e) {
        res.status(500).send(`Failed to create discussion: ${e.message}`);
    }
});

app.get('/getDiscussions', async (req, res) => {
    try {
        const collection = database.collection('discussions'); 
        const discussions = await collection.find({}).toArray(); 
        res.status(200).json(discussions); 
    } catch (e) {
        res.status(500).send(`Failed to fetch discussions: ${e.message}`);
    }
});

app.put('/addComment', async (req, res) => {
    const { discussionId, comment } = req.body;
    try {
        const collection = database.collection('discussions');
        const filter = { _id: new ObjectId(discussionId) }; // Convert discussionId to ObjectId
        const updateDoc = {
            $push: {
                comments: {
                    ...comment,
                    createdAt: new Date(), // Add a timestamp
                },
            },
        };
        const result = await collection.updateOne(filter, updateDoc);
        if (result.modifiedCount === 0) {
            return res.status(404).send('Discussion not found.');
        }
        res.status(200).send('Comment added successfully.');
    } catch (e) {
        console.error('Failed to add comment:', e.message);
        res.status(500).send(`Failed to add comment: ${e.message}`);
    }
});

app.delete('/deleteDiscussion', async (req, res) => {
    const { discussionId } = req.body; 
    try {
        const collection = database.collection('discussions'); 
        const filter = { _id: new MongoClient.ObjectId(discussionId) };
        const result = await collection.deleteOne(filter); 
        if (result.deletedCount === 0) {
            return res.status(404).send('Discussion not found.');
        }
        res.status(200).send('Discussion deleted successfully.');
    } catch (e) {
        res.status(500).send(`Failed to delete discussion: ${e.message}`);
    }
});

app.get('/getDiscussion', async (req, res) => {
    const { discussionId } = req.query; 
    try {
        const collection = database.collection('discussions'); 
        const discussion = await collection.findOne({ _id: new MongoClient.ObjectId(discussionId) }); // Find the discussion by its ID
        if (!discussion) {
            return res.status(404).send('Discussion not found.');
        }
        res.status(200).json(discussion); 
    } catch (e) {
        res.status(500).send(`Failed to fetch discussion: ${e.message}`);
    }
});

        
app.listen(port, async () => {
    try {
        await client.connect();
        database = client.db('mydb');
        console.log(`Server is running on port ${port}`);
    } catch (e) {
        console.error(`Failed to connect to the database: ${e.message}`);
    }
});