-- MyT Codon DML
-- The colon : character is used to denote variables (typically user inputs)


-- LABNOTEBOOKS/PROJECTSTAFF PAGE --------------------------------------------------

-- READ LabNotebooks table without a MitoGene filter applied
SELECT
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
ORDER BY LN.SpecialProjectName ASC;

-- READ LabNotebooks table with a MitoGene filter applied
SELECT
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
        AND MG.HgncSymbol = :inputHgncSymbol
ORDER BY LN.SpecialProjectName ASC;

-- READ ProjectStaff table
SELECT
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
FullName ASC;

-- READ MitoGene names for ProjectStaff dropdown
SELECT DISTINCT
HgncSymbol
FROM MitoGenes;

-- READ Researcher names for ProjectStaff dropdown
SELECT
ResearcherID,
CONCAT(FirstName," ", LastName) AS FullName
FROM Researchers;

-- CREATE LabNotebook entry where Completion is complete
INSERT INTO LabNotebooks (SpecialProjectName, CreationDate, TransfectionComplete, CompletionDate, StorageFreezer, FreezerBoxLoc)
VALUES
(:inputSpecialProjectName, NOW(), :inputTransfectionComplete, NOW(), :inputStorageFreezer, :inputFreezerBoxLoc);

-- CREATE LabNotebook entry where Completion is not complete
INSERT INTO LabNotebooks (SpecialProjectName, CreationDate, TransfectionComplete, CompletionDate, StorageFreezer, FreezerBoxLoc)
VALUES
(:inputSpecialProjectName, NOW(), :inputTransfectionComplete, NULL, :inputStorageFreezer, :inputFreezerBoxLoc);

-- CREATE a new ProjectStaff entry with the associated Researcher when a LabNotebook entry is created
INSERT INTO ProjectStaff (ResearcherID, LabNotebookID)
VALUES
(:inputNewProjectPI, (SELECT MAX(LabNotebookID) FROM LabNotebooks));

-- CREATE a new ProjectStaff entry, associating a Researcher with a LabNotebook 
INSERT INTO ProjectStaff (ResearcherID, LabNotebookID)
VALUES
(:inputResearcherID, :inputLabNotebookID);

-- DELETE a ProjectStaff entry
DELETE FROM ProjectStaff WHERE ResearcherID = :inputResearcherID AND LabNotebookID = :inputLabNotebookID;

-- RESEARCHERS PAGE --------------------------------------------------

-- READ Researchers table
SELECT
ResearcherID,
FirstName,
LastName,
CASE
    WHEN Credential = 1 THEN 'Yes'
    ELSE 'No'
END AS Credential
FROM Researchers;

-- CREATE Researcher entry
INSERT INTO Researchers (FirstName, LastName, Credential)
VALUES
(:inputFirstName, :inputLastName, :inputCredential);

-- UPDATE an existing Researcher
UPDATE Researchers 
SET FirstName = :inputFirstName, 
LastName = :inputLastName, 
Credential = :inputCredential 
WHERE ResearcherID = :inputResearcherID;

-- DELETE a Researcher, which also deletes its associated ProjectStaff entries
DELETE FROM ProjectStaff WHERE ResearcherID = :inputResearcherID;
DELETE FROM Researchers WHERE ResearcherID = :inputResearcherID;

-- CHIMERAS PAGE --------------------------------------------------

-- READ Chimeras table 
SELECT
C.ChimeraID,
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
ORDER BY SpecialProjectName ASC;

-- READ LabNotebook SpecialProjectName for dropdown menu
SELECT DISTINCT
LabNotebookID,
SpecialProjectName
FROM LabNotebooks;

-- READ MitoGene attributes for dropdown menu
SELECT * FROM MitoGenes;

-- READ Vector attributes for dropdown menu
SELECT * FROM Vectors;

-- CREATE new Chimera entry
INSERT INTO Chimeras (LabNotebookID, MitoGeneID, VectorID, ProviderName, DiseaseName)
VALUES
(:inputLabNotebookID, :inputMitoGeneID, :inputVectorID, :inputProviderName, :inputDiseaseName);

-- UPDATE LabNotebook FK of a Chimera (nullable)
UPDATE Chimeras SET Chimeras.LabNotebookID = :inputLabNotebookID WHERE ChimeraID = :inputChimeraID;

-- MITOGENES PAGE --------------------------------------------------

-- READ MitoGenes table
SELECT
MitoGeneID,
HgncID,
COALESCE(HgncSymbol, 'N/A') AS HgncSymbol,
COALESCE(HgncName, 'N/A') AS HgncName,
NCBIGeneID,
COALESCE(UniProtID, 'N/A') AS UniProtID
FROM MitoGenes;

-- CREATE a new MitoGene entry
INSERT INTO MitoGenes (HgncID, HgncSymbol, HgncName, NCBIGeneID, UniProtID) 
VALUES 
(:inputHgncID, :inputHgncSymbol, :inputHgncName, :inputNCBIGeneID, :inputUniProtID);

-- VECTORS PAGE --------------------------------------------------

-- READ Vectors table
SELECT 
V.VectorID,
V.ProductName, 
V.AntiBacterialID,
COALESCE(AB.AntiBacterialName, 'N/A') AS AntiBacterialName,
COALESCE(VectorSize, 'N/A') AS VectorSize,
COALESCE(RECutSites, 'N/A') AS RECutSites
FROM Vectors V 
    LEFT JOIN AntiBacterials AB 
        ON AB.AntiBacterialID = V.AntiBacterialID;

-- READ AntiBacterials for dropdown menu
SELECT * FROM AntiBacterials;

-- CREATE a new Vector entry
INSERT INTO Vectors (ProductName, AntiBacterialID, VectorSize, RECutSites)
VALUES
(:inputProductName, :inputAntiBacterialID, :inputVectorSize, :inputRECutSites);

-- ANTIBACTERIALS PAGE --------------------------------------------------

-- READ AntiBacterials table
SELECT * FROM AntiBacterials;

-- CREATE new AntiBacterial entry
INSERT INTO AntiBacterials (AntiBacterialName)
VALUES
(:inputAntiBacterialName)