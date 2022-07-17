'use strict';

const PORT = 2727;

// The variable stocks has the same value as the variable stocks in the file 'stocks.js'
const express = require("express");
const app = express();

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.send("Just a test...");
});
// Note: Don't add or change anything above this line.


// Note: Don't add or change anything below this line.
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});