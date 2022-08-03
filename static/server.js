'use strict';
console.log('Opening server.')

const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('public'));

console.log('Initialized Express.')

//Database
var db = require('./database/db-connector');
console.log('Found database.')

//Handlebars
const handlebars = require('express-handlebars');
const { query } = require('express');
app.engine('handlebars', handlebars.engine());
app.set('views', './views');
app.set('view engine', 'handlebars');
console.log('Initialized Handlebars.')

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
    let r_query = 'SELECT * FROM Researchers;';
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
            let r_query = 'SELECT * FROM Researchers;';
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

app.delete('/delete-researcher-ajax/', function(req,res,next){
    let data = req.body;
    let researcherID = parseInt(data.ResearcherID);
    let deleteProjectStaff = `DELETE FROM ProjectStaff WHERE ResearcherID = ?`;
    let deleteResearchers= `DELETE FROM Researchers WHERE ResearcherID = ?`;
  
          // Run the 1st query
          db.pool.query(deleteProjectStaff, [researcherID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteResearchers, [researcherID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

app.put('/put-researcher-ajax', function(req,res,next){
    let data = req.body;
  
    let credential = parseInt(data.credential);
    let researcher = parseInt(data.researcherId);
  
    let queryUpdateCredential = `UPDATE Researchers SET Credential = ? WHERE ResearcherID = ?`;
    let selectResearcher = `SELECT * FROM Researchers WHERE ResearcherID = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateCredential, [credential, researcher], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectResearcher, [researcher], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

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