'use strict';

const express = require("express");
const app = express();
const PORT = 9727;

//Database
//var db = require('./db-connection');

//Handlebars
//var exphbs = require('express-handlebars');
//const { query } = require('express');
//app.engine('.hbs', exphbs ({
    //extname: '.hbs'
//}));
//app.set('view engine', '.hbs');

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));

// Note: Don't add or change anything above this line.

//app.get('/researchers', function(req, res) {
    //let read_query = 'SELECT * FROM Researchers;';
    //db.pool.query(read_query, function(errors, rows, fields) {
        //res.render('researchers', {data: rows});
    //})
//});

// Note: Don't add or change anything below this line.
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...press Ctrl-C to terminate`);
});