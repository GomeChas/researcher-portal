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
    let r1_query;
    
    if (req.query.filterProjects === undefined) {
        r1_query = `SELECT
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
                        ORDER BY LN.SpecialProjectName ASC;`
    }
    else {
        r1_query = `SELECT
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
                            JOIN Chimeras C
                                ON C.LabNotebookID = LN.LabNotebookID
                            JOIN MitoGenes MG
                                ON MG.MitoGeneID = C.MitoGeneID
                                AND MG.HgncSymbol = '${req.query.filterProjects}'
                        ORDER BY LN.SpecialProjectName ASC;`
    };

    let r2_query = `SELECT
                    PS.ProjectStaffID,
                    LN.LabNotebookID,
                    LN.SpecialProjectName,
                    R.ResearcherID,
                    CONCAT(R.FirstName," ", R.LastName) AS FullName
                    FROM ProjectStaff PS 
                    JOIN LabNotebooks LN
                        ON LN.LabNotebookID = PS.LabNotebookID
                    JOIN Researchers R
                        ON R.ResearcherID = PS.ResearcherID
                    ORDER BY LN.SpecialProjectName ASC,
                    FullName ASC;`

    let g_selection_query = `SELECT DISTINCT
                            HgncSymbol
                            FROM MitoGenes;`;

    let r_selection_query = `SELECT
                                ResearcherID,
                                CONCAT(FirstName," ", LastName) AS FullName
                                FROM Researchers;`;
    
    db.pool.query(r1_query, function(errors, rows, fields) {
        db.pool.query(r2_query, function(errors, rows_2, fields) {
            db.pool.query(g_selection_query, function(errors, rows_3, fields) {
                db.pool.query(r_selection_query, function(errors, rows_4, fields) {
                    res.render('labnotebooks', {fetch: {notebooks: rows, projectstaff: rows_2, genes: rows_3, researchers: rows_4}});
                });
            });
        });
    });
});

app.post('/add_new_labnotebook', function(req, res) {
    let data = req.body;

    let storageFreezer = data.storageFreezer;
    if (data.storageFreezer < 1) {
        storageFreezer = 'NULL'
    } else {
        storageFreezer = `'${storageFreezer}'`
    }

    let freezerBoxLoc = 'NULL';
    if (data.fBLocPre !== '' && data.fBLocSuf !== '') {
        freezerBoxLoc = "'" + data.fBLocPre + '-' + data.fBLocSuf + "'";
    }

    let u1_query = `INSERT INTO LabNotebooks (SpecialProjectName, CreationDate, TransfectionComplete, CompletionDate, StorageFreezer, FreezerBoxLoc)
                    VALUES
                    ('${data.specialProjectName}', NOW(), ${data.transfectionComplete}, NULL, ${storageFreezer}, ${freezerBoxLoc})`;
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

app.delete('/remove_project_staff/', function(req,res,next){
    let data = req.body;

    let researcherID = parseInt(data.ResearcherID);
    let labNotebookID = parseInt(data.LabNotebookID);
    let deleteProjectStaff = `DELETE FROM ProjectStaff WHERE ResearcherID = ? AND LabNotebookID = ?`;

        db.pool.query(deleteProjectStaff, [researcherID, labNotebookID], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else {
                res.sendStatus(204);
            }
        });
});

app.post('/add_staff_to_project', function(req, res) {
    let data = req.body;

    let u_query = `INSERT INTO ProjectStaff (ResearcherID, LabNotebookID)
                    VALUES
                    (${data.add_staff}, ${data.staff_to_project});`
    db.pool.query(u_query, function(error, rows, fields) {
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
                    ('${data.FirstName}','${data.LastName}',${data.Credential})`;
    db.pool.query(u_query, function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/researchers')
        }
    });
});

app.post('/update_researcher', function(req, res) {
    let data = req.body;

    let researcherId = data['input-researcherid'];
    let firstName = data['input-update-firstname'];
    let lastName = data['input-update-lastname'];
    let credential = data['Credential'];

    let u_query = `UPDATE Researchers SET FirstName = ?, LastName = ?, Credential = ? WHERE ResearcherID = ?`
    db.pool.query(u_query, [firstName, lastName, credential, researcherId], function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/researchers')
        }
    });
});

app.post('/delete_researcher', function(req, res) {
    let data = req.body;

    let researcherId = data['input-researcherid'];

    let u_query = `DELETE FROM Researchers WHERE ResearcherID = ?`
    db.pool.query(u_query, [researcherId], function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/researchers')
        }
    });
});

app.delete('/delete-researcher/', function(req,res,next){
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

app.get('/chimeras', function(req, res) {
    let r_query = `SELECT
                    ChimeraID,
                    LN.LabNotebookID,
                    COALESCE(LN.SpecialProjectName, 'N/A') AS SpecialProjectName,
                    MG.MitoGeneID,
                    COALESCE(MG.HgncSymbol, 'N/A') AS HgncSymbol,
                    V.VectorID,
                    COALESCE(V.ProductName, 'N/A') AS ProductName,
                    COALESCE(ProviderName, 'N/A') AS ProviderName,
                    COALESCE(DiseaseName, 'N/A') AS DiseaseName
                    FROM Chimeras C
                        INNER JOIN MitoGenes MG
                            ON MG.MitoGeneID = C.MitoGeneID
                        INNER JOIN Vectors V
                            ON V.VectorID = C.VectorID
                        LEFT JOIN LabNotebooks LN
                            ON LN.LabNotebookID = C.LabNotebookID
                    ORDER BY SpecialProjectName ASC;`;
    let l_selection_query = `SELECT DISTINCT
                                LabNotebookID,
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

app.post('/add_new_chimera', function(req, res) {
    let data = req.body;

    let LabNotebookID = parseInt(data.LabNotebookID);
    if (isNaN(LabNotebookID)) {
        LabNotebookID = 'NULL'
    };

    let mitoGeneID = parseInt(data.mitoGeneID);
    if (isNaN(mitoGeneID)) {
        mitoGeneID = 'NULL'
    };

    let vectorID = parseInt(data.vectorID);
    if (isNaN(vectorID)) {
        vectorID = 'NULL'
    };

    let u_query = `INSERT INTO Chimeras (LabNotebookID, MitoGeneID, VectorID, ProviderName, DiseaseName)
                    VALUES
                    (${LabNotebookID},${mitoGeneID},${vectorID},'${data.providerName}','${data.diseaseName}')`;
    db.pool.query(u_query, function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/chimeras')
        }
    });
});

app.post('/update_chimera', function(req, res) {
    let data = req.body;

    let chimeraId = data['input-chimeraid'];
    let labNotebookId = data['input-labnotebookid'];

    if (labNotebookId === "none") {
        labNotebookId = 'NULL'
    }

    let u_query = `UPDATE Chimeras SET Chimeras.LabNotebookID = ${labNotebookId} WHERE ChimeraID = ${chimeraId}`
    db.pool.query(u_query, function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/chimeras')
        }
    });
});

app.get('/genes', function(req, res) {
    let r_query = `SELECT
                    MitoGeneID,
                    HgncID,
                    COALESCE(HgncSymbol, 'N/A') AS HgncSymbol,
                    COALESCE(HgncName, 'N/A') AS HgncName,
                    NCBIGeneID,
                    COALESCE(UniProtID, 'N/A') AS UniProtID
                    FROM MitoGenes;`;
    db.pool.query(r_query, function(errors, rows, fields) {
        res.render('genes', {data: rows});
    })
});

app.post('/add_new_gene', function(req, res) {
    let data = req.body;

    let HgncSymbol = data.hgnc_symbol;
    let finalHgncSymbol = "\'\"";
    if(HgncSymbol.length == 0) {
        finalHgncSymbol = 'NULL'
    } else {     
        finalHgncSymbol += HgncSymbol
        finalHgncSymbol += "\"\'"
    };

    let HgncName = data.hgnc_name;
    let finalHgncName = "\'\"";
    if(HgncName.length == 0) {
        finalHgncName = 'NULL'
    } else {
        finalHgncName += HgncName
        finalHgncName += "\"\'"
    };

    let UniProtID = data.uniprot_id;
    let finalUniProtID = "\'\"";
    if(UniProtID.length == 0) {
        finalUniProtID = 'NULL'
    } else {
        finalUniProtID += UniProtID
        finalUniProtID += "\"\'"
    };

    let u_query = `INSERT INTO MitoGenes (HgncID, HgncSymbol, HgncName, NCBIGeneID, UniProtID) VALUES (${data.hgnc_id},${finalHgncSymbol},${finalHgncName},${data.ncbi_id},${finalUniProtID})`;
    db.pool.query(u_query, function(error, rows, fields) {
        if (error) {
        console.log(error)
        res.sendStatus(400);
        }
        else {
            res.redirect('/genes');
        }
    });
});

app.get('/vectors', function(req, res) {
    let r_query = `SELECT 
                    V.VectorID,
                    V.ProductName, 
                    V.AntiBacterialID,
                    COALESCE(AB.AntiBacterialName, 'N/A') AS AntiBacterialName,
                    COALESCE(VectorSize, 'N/A') AS VectorSize,
                    COALESCE(RECutSites, 'N/A') AS RECutSites
                    FROM Vectors V 
                        LEFT JOIN AntiBacterials AB 
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

    let antiBacterialID = parseInt(data.antiBacterialID);
    if(isNaN(antiBacterialID)){
        antiBacterialID = 'NULL'
    };

    let vectorSize = parseInt(data.vectorSize);
    if(isNaN(vectorSize)){
        vectorSize = 'NULL'
    };

    let inputRECutSites = data.reCutSite;
    let RECutSitesValue;
    if(typeof(inputRECutSites) == 'undefined') {
        RECutSitesValue = 'N/A'
    }
    else { for (let i = 0; i < inputRECutSites.length; i++) {
            if (typeof(RECutSitesValue) == 'undefined') {
                let newRECutSite = inputRECutSites[i]
                RECutSitesValue = newRECutSite;
            }
            else {
                let newRECutSite = inputRECutSites[i]
                RECutSitesValue += `, ${newRECutSite}`;
            }
        };
    };

    let u_query = `INSERT INTO Vectors (ProductName, AntiBacterialID, VectorSize, RECutSites)
                    VALUES
                    ('${data.productName}',${antiBacterialID},${vectorSize},'${RECutSitesValue}')`;
    db.pool.query(u_query, function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/vectors')
            }
    });
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