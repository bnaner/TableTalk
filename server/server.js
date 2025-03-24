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
        const hashedPassword = await bcrypt.hash(password, 10);
        const doc = { name, email, profileMessage, groups, password: hashedPassword };
        await collection.insertOne(doc);
        res.status(200).send('Document inserted successfully.');
    } catch (e) {
        res.status(500).send(`Insert failed: ${e.message}`);
    }
});

app.put('/update', async (req, res) => {
    const { name, newEmail, newProfileMessage, newGroups, newPassword } = req.body;
    try {
        const collection = database.collection('users');
        const filter = { name };
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateDoc = {
            $set: {
                email: newEmail,
                profileMessage: newProfileMessage,
                groups: newGroups,
                password: hashedPassword
            }
        };
        await collection.updateOne(filter, updateDoc);
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
        await collection.deleteOne(filter);
        res.status(200).send('Document deleted successfully.');
    } catch (e) {
        res.status(500).send(`Delete failed: ${e.message}`);
    }
});

app.get('/find', async (req, res) => {
    const { name } = req.query;
    try {
        const collection = database.collection('users');
        const filter = { name };
        const result = await collection.findOne(filter);
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
        const cursor = await collection.find({}).toArray();
        res.status(200).json(cursor);
    } catch (e) {
        res.status(500).send(`Find all failed: ${e.message}`);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });
    try {
      const collection = database.collection('users');
      const user = await collection.findOne({ email });
      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);
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

app.listen(port, async () => {
    try {
        await client.connect();
        database = client.db('mydb');
        console.log(`Server is running on port ${port}`);
    } catch (e) {
        console.error(`Failed to connect to the database: ${e.message}`);
    }
});