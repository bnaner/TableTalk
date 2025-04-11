const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const app = express();
const port = 5000;

const uri = "mongodb+srv://Admin1:pass98@tabletalk-mongo.vh4ln.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let database;

app.use(express.json());

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

app.put('/updateGame', async (req, res) => {
    const { name, newRating, newComment } = req.body;
    try {
        const collection = database.collection('games');
        const filter = { name };
        const updateDoc = {
            $push: {
                rating: newRating, //push rating into array
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