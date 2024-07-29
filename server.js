const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    // Send a message to the client
    res.json({ message: 'GET request received to get notes' });

    // Log our request to the terminal
    console.info(`${req.method} request received to get notes`);
});

app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
        };

        // Convert the data to a string so we can save it
        const notesString = JSON.stringify(newNote);

        fs.readFileAndwriteFile(`./db/${newNote.title}.json`, notesString, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json('Error in posting note');
            } else {
                console.log(`Notes for ${newNote.title} has been written to JSON file`);
                const response = {
                    status: 'success',
                    body: newNote,
                };
                console.log(response);
                res.status(201).json(response);
            }
        });
    } else {
        res.status(400).json('Error in posting note');
    }
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);