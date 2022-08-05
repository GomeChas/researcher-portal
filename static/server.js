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
    let r_query;
    
    if (req.query.filterProjects === undefined) {
        r_query = `SELECT
                        PS.ProjectStaffID,
                        CONCAT(R.FirstName," ", R.LastName) AS FullName,
                        LN.LabNotebookID,
                        LN.SpecialProjectName,
                        LN.CreationDate,
                        CASE
                            WHEN LN.TransfectionComplete = 1 THEN 'Yes'
                            ELSE 'No'
                        END AS TransfectionComplete,
                        COALESCE(LN.CompletionDate,'N/A') AS CompletionDate,
                        COALESCE(LN.StorageFreezer,'N/A') AS StorageFreezer,
                        COALESCE(LN.FreezerBoxLoc,'N/A') AS FreezerBoxLoc
                        FROM LabNotebooks LN
                            LEFT JOIN ProjectStaff PS
                                ON PS.LabNotebookID = LN.LabNotebookID
                            LEFT JOIN Researchers R
                                ON R.ResearcherID = PS.ResearcherID
                        ORDER BY LN.CreationDate ASC;`
    }
    else {
        r_query = `SELECT
                        PS.ProjectStaffID,
                        CONCAT(R.FirstName," ", R.LastName) AS FullName,
                        LN.LabNotebookID,
                        LN.SpecialProjectName,
                        LN.CreationDate,
                        CASE
                            WHEN LN.TransfectionComplete = 1 THEN 'Yes'
                            ELSE 'No'
                        END AS TransfectionComplete,
                        COALESCE(LN.CompletionDate,'N/A') AS CompletionDate,
                        COALESCE(LN.StorageFreezer,'N/A') AS StorageFreezer,
                        COALESCE(LN.FreezerBoxLoc,'N/A') AS FreezerBoxLoc
                        FROM LabNotebooks LN
                            JOIN ProjectStaff PS
                                ON PS.LabNotebookID = LN.LabNotebookID
                            JOIN Researchers R
                                ON R.ResearcherID = PS.ResearcherID
                            JOIN Chimeras C
                                ON C.LabNotebookID = LN.LabNotebookID
                            JOIN MitoGenes MG
                                ON MG.MitoGeneID = C.MitoGeneID
                                AND MG.HgncSymbol = '${req.query.filterProjects}'
                        ORDER BY LN.CreationDate ASC;`
    };

    let g_selection_query = `SELECT DISTINCT
                            HgncSymbol
                            FROM MitoGenes;`;

    let r_selection_query = `SELECT
                                ResearcherID,
                                CONCAT(FirstName," ", LastName) AS FullName
                                FROM Researchers;`;
    
    db.pool.query(r_query, function(errors, rows, fields) {
        db.pool.query(g_selection_query, function(errors, rows_2, fields) {
            db.pool.query(r_selection_query, function(errors, rows_3, fields) {
                res.render('labnotebooks', {fetch: {data: rows, data_2: rows_2, data_3: rows_3}});
            });
        });
    });
});

app.get('/labnotebook_update', function(req, res) {
    res.render('labnotebook_update');
});

app.post('/add_new_labnotebook', function(req, res) {
    let data = req.body;
    let FreezerBoxLoc = data.fBLocPre + '-' + data.fBLocSuf
    let u1_query = `INSERT INTO LabNotebooks (SpecialProjectName, CreationDate, TransfectionComplete, CompletionDate, StorageFreezer, FreezerBoxLoc)
                    VALUES
                    ('${data.specialProjectName}', NOW(), ${data.transfectionComplete}, NULL, '${data.storageFreezer}', '${FreezerBoxLoc}')`;
    let u2_query = `INSERT INTO ProjectStaff (ResearcherID, LabNotebookID)
                    VALUES
                    (${data.newProjectPI}, (SELECT MAX(LabNotebookID) FROM LabNotebooks));`
    db.pool.query(u1_query, function(error, rows, fields) {
        db.pool.query(u2_query, function(error, rows, fields) {
            if (error) {
                console.log(error)
                res.sendStatus(400);
            }});
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else { 
                res.redirect('/labnotebooks')
            }
        });
    });



app.get('/researchers', function(req, res) {
    let r_query = `SELECT
                    ResearcherID,
                    FirstName,
                    LastName,
                    CASE
                        WHEN Credential = 1 THEN 'Yes'
                        ELSE 'No'
                    END AS Credential
                    FROM Researchers;`;
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
            let r_query = `SELECT
                            ResearcherID,
                            FirstName,
                            LastName,
                            CASE
                                WHEN Credential = 1 THEN 'Yes'
                                ELSE 'No'
                            END AS Credential
                            FROM Researchers;`;
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

app.put('/put-researcher', function(req,res,next){
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

app.delete('/delete-researcher/', function(req,res,next){
    let data = req.body;
    console.log(data);
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

app.get('/chimeras', function(req, res) {
    let r_query = `SELECT
                    LN.LabNotebookID,
                    LN.SpecialProjectName,
                    MG.MitoGeneID,
                    MG.HgncSymbol,
                    V.VectorID,
                    V.ProductName,
                    ProviderName,
                    DiseaseName
                    FROM Chimeras C
                        INNER JOIN MitoGenes MG
                            ON MG.MitoGeneID = C.MitoGeneID
                        INNER JOIN Vectors V
                            ON V.VectorID = C.VectorID
                        INNER JOIN LabNotebooks LN
                            ON LN.LabNotebookID = C.LabNotebookID;`;
    let l_selection_query = `SELECT DISTINCT
                                SpecialProjectName
                            FROM LabNotebooks`;
    let m_selection_query = `SELECT * FROM MitoGenes;`;
    let v_selection_query = `SELECT * FROM Vectors`;
    db.pool.query(r_query, function(errors, rows, fields) {
        db.pool.query(l_selection_query, function(errors, rows_2, fields) {
            db.pool.query(m_selection_query, function(errors, rows_3, fields) {
                db.pool.query(v_selection_query, function(errors, rows_4, fields) {
                    res.render('chimeras', {fetch: {data: rows, data_2: rows_2, data_3: rows_3, data_4: rows_4}});
                });
            });
        });
    })
});

app.get('/genes', function(req, res) {
    let r_query = `SELECT
                    MitoGeneID,
                    HgncID,
                    HgncSymbol,
                    HgncName,
                    COALESCE(NCBIGeneID, 'N/A') AS NCBIGeneID,
                    COALESCE(UniProtID, 'N/A') AS UniProtID
                    FROM MitoGenes;`;
    db.pool.query(r_query, function(errors, rows, fields) {
        res.render('genes', {data: rows});
    })
});

app.post('/add_new_gene', function(req, res) {
    let data = req.body;

    let u_query = `INSERT INTO MitoGenes (HgncID, HgncSymbol, HgncName, NCBIGeneID, UniProtID)
                    VALUES
                    ('${data.HgncID}','${data.HgncSymbol}','${data.HgncName}','${data.NCBIGeneID}','${data.UniProtID}')`;
    db.pool.query(u_query, function(error, rows, fields) {

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            let r_query = `SELECT
                            MitoGeneID,
                            HgncID,
                            HgncSymbol,
                            HgncName,
                            COALESCE(NCBIGeneID, 'N/A') AS NCBIGeneID,
                            COALESCE(UniProtID, 'N/A') AS UniProtID
                            FROM MitoGenes;`;
            db.pool.query(r_query, function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.redirect('/genes');
                }
            })
        }
    })
});

app.get('/vectors', function(req, res) {
    let r_query = `SELECT 
                    V.VectorID,
                    V.ProductName, 
                    V.AntiBacterialID,
                    AB.AntiBacterialName, 
                    VectorSize, 
                    RECutSites 
                    FROM Vectors V 
                        INNER JOIN AntiBacterials AB 
                            ON AB.AntiBacterialID = V.AntiBacterialID;`;
    let selection_query = 'SELECT * FROM AntiBacterials;';
    db.pool.query(r_query, function(errors, rows, fields) {
        db.pool.query(selection_query, function(errors, rows_2, fields) {
            res.render('vectors', {fetch: {data: rows, data_2: rows_2}});
        });
    });
});

app.post('/add_new_vector', function(req, res) {
    let data = req.body;

    let u_query = `INSERT INTO Vectors (ProductName, AntiBacterialID, VectorSize, RECutSites)
                    VALUES
                    ('${data.ProductName}','${data.AntiBacterialID}','${data.VectorSize}','${data.RECutSites}')`;
    db.pool.query(u_query, function(error, rows, fields) {

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            let r_query = `SELECT 
                            V.VectorID,
                            V.ProductName, 
                            V.AntiBacterialID,
                            AB.AntiBacterialName, 
                            VectorSize, 
                            RECutSites 
                            FROM Vectors V 
                                INNER JOIN AntiBacterials AB 
                                    ON AB.AntiBacterialID = V.AntiBacterialID;`;
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

app.get('/antibacterials', function(req, res) {
    let r_query = 'SELECT * FROM AntiBacterials;';
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
            let r_query = 'SELECT * FROM AntiBacterials;';
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