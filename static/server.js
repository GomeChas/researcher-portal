'use strict';

const express = require("express");
const app = express();
const PORT = 9727;

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('public'));

//Database
var db = require('./database/db-connector');

//Handlebars
const handlebars = require('express-handlebars');
const { query } = require('express');
app.engine('handlebars', handlebars.engine());
app.set('views', './views');
app.set('view engine', 'handlebars');

// Note: Don't add or change anything above this line.

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/about', function(req, res) {
    res.render('about');
});

app.get('/labnotebooks', function(req, res) {
    let r_query = `SELECT
                    a.Project_Staff,
                    C.ProviderName,
                    C.DiseaseName,
                    M.HgncSymbol,
                    V.ProductName,
                    LN.CreationDate,
                    LN.TransfectionComplete,
                    LN.CompletionDate,
                    LN.StorageFreezer,
                    LN.FreezerBoxLoc
                    FROM (
                        SELECT
                        b.LabNotebookID,
                        GROUP_CONCAT(Name SEPARATOR ', ') AS Project_Staff
                        FROM (
                            SELECT
                            PS.ProjectStaffID,
                            PS.LabNotebookID,
                            CONCAT(R.FirstName,' ',R.LastName) AS Name
                            FROM ProjectStaff PS
                                INNER JOIN Researchers R
                                    ON PS.ResearcherID = R.ResearcherID
                            ) b
                        GROUP BY b.LabNotebookID
                    ) a
                    JOIN LabNotebooks LN
                        ON a.LabNotebookID = LN.LabNotebookID
                    JOIN Chimeras C
                        ON C.LabNotebookID = LN.LabNotebookID
                    JOIN MitoGenes M
	                    ON M.MitoGeneID = C.MitoGeneID
                    JOIN Vectors V
	                    ON V.VectorID = C.VectorID;`
    db.pool.query(r_query, function(errors, rows, fields) {
        res.render('labnotebooks', {data: rows});
    })
});

app.get('/researchers', function(req, res) {
    let r_query = 'SELECT FirstName, LastName, Credential FROM Researchers;';
    db.pool.query(r_query, function(errors, rows, fields) {
        res.render('researchers', {data: rows});
    })
});

app.post('/add_new_researcher', function(req, res) {
    let data = req.body;

    let u_query = `INSERT INTO Researchers (FirstName, LastName, Credential)
                    VALUES
                    ('${data.FirstName}','${data.LastName}','${data.Credential}')`;
    db.pool.query(u_query, function(error, rows, fields) {

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            let r_query = 'SELECT FirstName, LastName, Credential FROM Researchers;';
            db.pool.query(r_query, function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.get('/chimeras', function(req, res) {
    let r_query = `SELECT
                    MG.HgncSymbol,
                    V.ProductName,
                    ProviderName,
                    DiseaseName
                    FROM Chimeras C
                        INNER JOIN MitoGenes MG
                            ON MG.MitoGeneID = C.MitoGeneID
                        INNER JOIN Vectors V
                            ON V.VectorID = C.VectorID;`
    db.pool.query(r_query, function(errors, rows, fields) {
        res.render('chimeras', {data: rows});
    })
});

app.get('/genes', function(req, res) {
    let r_query = 'SELECT HgncID, HgncSymbol, HgncName, NCBIGeneID, UniProtID FROM MitoGenes;';
    db.pool.query(r_query, function(errors, rows, fields) {
        res.render('genes', {data: rows});
    })
});

app.get('/vectors', function(req, res) {
    let r_query = 'SELECT ProductName, AB.AntiBacterialName, VectorSize, RECutSites FROM Vectors V INNER JOIN AntiBacterials AB ON AB.AntiBacterialID = V.AntiBacterialID;';
    db.pool.query(r_query, function(errors, rows, fields) {
        res.render('vectors', {data: rows});
    })
});

app.get('/antibacterials', function(req, res) {
    let r_query = 'SELECT AntiBacterialName FROM AntiBacterials;';
    db.pool.query(r_query, function(errors, rows, fields) {
        res.render('antibacterials', {data: rows});
    })
});

app.post('/add_new_antibacterial', function(req, res) {
    let data = req.body;

    let u_query = `INSERT INTO AntiBacterials (AntiBacterialName)
                    VALUES
                    ('${data.AntiBacterialName}')`;
    db.pool.query(u_query, function(error, rows, fields) {

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            let r_query = 'SELECT AntiBacterialName FROM AntiBacterials;';
            db.pool.query(r_query, function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
});

// Note: Don't add o  r change anything below this line.
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...press Ctrl-C to terminate`);
});