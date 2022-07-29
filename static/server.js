'use strict';

const PORT = 9727;

// The variable stocks has the same value as the variable stocks in the file 'stocks.js'
const express = require("express");
const app = express();

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


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

//ROUTES
app.get('/', function(req, res)
    {
        res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    });

// Note: Don't add or change anything below this line.
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...press Ctrl-C to terminate`);
});