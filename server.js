const express = require('express');
const bodyParser = require('body-parser');
const r = require('rethinkdb');

const app = express();
const PORT = 4003;

app.use(bodyParser.json());

// Connect to RethinkDB
const req = require('rethinkdb');
const connectionOptions = {
    host: 'localhost', // or server IP
    port: 28015,       // default RethinkDB port
};

let conn;
r.connect(connectionOptions, (err, connection) => {
    if (err) {
        console.error('Connection failed:', err);
    } else {
        console.log('Connected to RethinkDB');
        conn = connection; // Save the connection globally
    }
});
app.post('/test-insert', async (req, res) => {
    const testData = { name: 'Test Data', createdAt: new Date() };
    try {
        const result = await r.table('designs').insert(testData).run(global.conn);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error inserting data');
    }
});


// Route for practicing code
app.post('/api/code', (req, res) => {
    const { language, code } = req.body;
    console.log(`Code received for language: ${language}`);
    res.status(200).send(`Code received for language: ${language}`);
});

// Route for uploading graphic designs
app.post('/api/designs', (req, res) => {
    const { userId, design } = req.body;
    r.table('designs').insert({ userId, design }).run(conn, (err, result) => {
        if (err) {
            res.status(500).send('Error uploading design');
        } else {
            res.status(201).send('Design uploaded successfully');
        }
    });
});

// Route for uploading writings
app.post('/api/writings', (req, res) => {
    const { userId, title, content } = req.body;
    r.table('writings').insert({ userId, title, content }).run(conn, (err, result) => {
        if (err) {
            res.status(500).send('Error uploading writing');
        } else {
            res.status(201).send('Writing uploaded successfully');
        }
    });
});

// Route for following users
app.post('/api/follow', (req, res) => {
    const { followerId, followeeId } = req.body;
    r.table('follows').insert({ followerId, followeeId }).run(conn, (err, result) => {
        if (err) {
            res.status(500).send('Error following user');
        } else {
            res.status(201).send('Followed successfully');
        }
    });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Freelance App!');
});

app.listen(4003, () => {
    console.log(`Server running on http://localhost:${4003}`);
});
app.post('/test-insert', async (req, res) => {
    const testData = { name: 'Test Data', createdAt: new Date() };
    try {
        const result = await r.table('designs').insert(testData).run(global.conn);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error inserting data');
    }
});
// Route to get all designs
app.get('/designs', async (req, res) => {
    try {
        const result = await r.table('designs').run(global.conn);
        const designs = await result.toArray();
        res.json(designs); // Sends the designs as a response
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching designs');
    }
});
// Route to get a specific design by id
app.get('/designs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await r.table('designs').get(id).run(global.conn);
        if (!result) {
            return res.status(404).send('Design not found');
        }
        res.json(result); // Send the specific design as response
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching design');
    }
});
app.put('/designs/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    
    try {
        const result = await r.table('designs').get(id).update({
            name: name,
            updatedAt: new Date()
        }).run(global.conn);

        if (result.updated === 0) {
            return res.status(404).json({ error: 'Design not found' });
        }

        res.json({ id, name, updatedAt: new Date() });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating design');
    }
});

// Route to delete a design
app.delete('/designs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await r.table('designs').get(id).delete().run(global.conn);
        if (result.deleted === 0) {
            return res.status(404).send('Design not found');
        }
        res.send('Design deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting design');
    }
});

// Define route to serve the practice code HTML file
app.get('/practice-code', (req, res) => {
    res.sendFile(__dirname + '/public/practice-code.html');
});

// Define route to serve the practice graphic designing HTML file
app.get('/practice-graphic-designing', (req, res) => {
    res.sendFile(__dirname + '/public/practice-graphic-designing.html');
});

// Define route to serve the practice writing HTML file
app.get('/practice-writing', (req, res) => {
    res.sendFile(__dirname + '/public/practice-writing.html');
});
const path = require('path');

// Serve the static HTML files from the 'public' folder
app.get('/practice-code', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'practice-code.html'));
});

app.get('/practice-graphic-designing', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'practice-graphic-designing.html'));
});

app.get('/practice-writing', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'practice-writing.html'));
});

// Listen on the desired port
app.listen(4002, () => {
    console.log('Server is running on http://localhost:4003');
});
function connectToRethinkDB() {
    r.connect(connectionOptions, (err, connection) => {
        if (err) {
            console.error('Failed to connect to RethinkDB:', err);
            setTimeout(connectToRethinkDB, 4002); // Retry after 5 seconds
        } else {
            console.log('Reconnected to RethinkDB');
            global.conn = connection; // Save connection globally
        }
    });
}

// Use the function to reconnect
connectToRethinkDB();
