'use strict';

const PORT = 9727;

// The variable stocks has the same value as the variable stocks in the file 'stocks.js'
const express = require("express");
const app = express();

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');
const { query } = require('express');
app.engine('.hbs', engine({extname: ".hbs"}));
app.set('view engine', '.hbs');


// Database
var db = require('./db-connector')

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));

// Note: Don't add or change anything above this line.

//ROUTES
app.get('/', function(req, res)
    {
        res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    });

    app.get("/researchers", (req, res) => {
        let query1 = "SELECT FirstName AS `First Name`, "
                            "LastName AS `Last Name`, "
                            "Credential AS `Active Credential`"
                            "FROM Researchers;";
        db.pool.query(query1,function(error, rows, fields) {
            res.render('index', {data: rows});
        })
    });

// Note: Don't add or change anything below this line.
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...press Ctrl-C to terminate`);
});