const express = require('express');
const { MongoClient } = require('mongodb');
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
    const { name, rating, description, comments, genre } = req.body; //takes in name, rating, description, comments, genre. Maybe subject to change
    try {
        const collection = database.collection('games'); //get collection
        const doc = { 
            name, 
            rating: [rating], //init as an array
            description, 
            comments: [comments], //same here
            genre 
        };
        await collection.insertOne(doc);
        res.status(200).send('Game inserted successfully.');
    } catch (e) {
        res.status(500).send(`Insert game failed: ${e.message}`);
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

app.listen(port, async () => {
    try {
        await client.connect();
        database = client.db('mydb');
        console.log(`Server is running on port ${port}`);
    } catch (e) {
        console.error(`Failed to connect to the database: ${e.message}`);
    }
});