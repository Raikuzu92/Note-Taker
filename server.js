const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});
app.get('api/notes', (req, res) => {
console.log("test")
    // Log the request to the terminal
    console.info(`${req.method} request received to get notes`);

    // Read the existing data from the JSON file
    fs.readFile(`./db/db.json`, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json('Error in getting note');
        } else {
            let existingData = [];
            if (data) {
                existingData = JSON.parse(data);
            }
            console.log(data)
            // Append the new data to the existing data
            existingData.push(newNote);

            // Write the updated data back to the JSON file
            fs.appendFile(`./db/db.json`, JSON.stringify(existingData), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json('Error in appending note');
                } else {
                    console.log(`Data appended`);
                    res.status(200).json('Data appended successfully');
                }
            });
        }
    });
});


app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
    console.log(title);
    console.log(text);
    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
        };
        console.log(newNote);
        // Convert the data to a string so we can save it
        const notesString = JSON.stringify(newNote, null, 4);
        console.log(notesString);
        fs.writeFile(`./db/db.json`, notesString, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json('Error in posting note');
            } else {
                console.log(`Notes for has been written to JSON file`);
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