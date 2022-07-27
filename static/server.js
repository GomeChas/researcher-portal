'use strict';

const PORT = 9727;

// The variable stocks has the same value as the variable stocks in the file 'stocks.js'
const express = require("express");
const app = express();

// Database
var db = require('./db-connector')

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.send("This is just a test...");
});
// Note: Don't add or change anything above this line.


// Note: Don't add or change anything below this line.
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...press Ctrl-C to terminate`);
});