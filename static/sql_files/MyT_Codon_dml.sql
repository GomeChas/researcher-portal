-- List all LabNotebooks on the home page with the associated Researchers' names
SELECT
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
;
-- List distinct SpecialProjectNames for selection --
SELECT DISTINCT
SpecialProjectName
FROM LabNotebooks
;
-- List all Researchers on the Researchers page
SELECT
ResearcherID,
FirstName,
LastName,
CASE
    WHEN Credential = 1 THEN 'Yes'
    ELSE 'No'
END AS Credential
FROM Researchers
;
-- List all MitoGenes on the Genes page
SELECT
MitoGeneID,
HgncID,
HgncSymbol,
HgncName,
COALESCE(NCBIGeneID, 'N/A') AS NCBIGeneID,
COALESCE(UniProtID, 'N/A') AS UniProtID
FROM MitoGenes
;
-- List all Vectors on the Vectors page with the AntiBacterial name
SELECT 
V.VectorID,
V.ProductName, 
V.AntiBacterialID,
AB.AntiBacterialName, 
VectorSize, 
RECutSites 
FROM Vectors V 
    INNER JOIN AntiBacterials AB 
        ON AB.AntiBacterialID = V.AntiBacterialID
;
-- List all Chimeras on the Chimeras page
SELECT
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
        ON LN.LabNotebookID = C.LabNotebookID
;
-- List all AntiBacterials on the AntiBacterials page
SELECT
*
FROM AntiBacterials
;

-- For the following INSERT functionalities, the colon : character will be used to denote variables

-- Create a new LabNotebook --------------------
INSERT INTO LabNotebooks(
    SpecialProjectName,
    CreationDate,
    TransfectionComplete,
    CompletionDate,
    StorageFreezer,
    FreezerBoxLoc
)
VALUES
(:SpecialProjectName, :currentDate, 0, NULL, :storageFreezerInput, :freezerBoxLocInput);

-- When creating a new LabNotebook, a ProjectStaff entry will be created for each staff member selected
INSERT INTO ProjectStaff (
    ResearcherID,
    LabNotebookID
)
VALUES
(:researcherIDSelection, :newLabNotebookID);

-- Create a new Researcher --------------------
INSERT INTO Researchers (
    FirstName,
    LastName,
    Credential
)
VALUES
(:firstNameInput, :lastNameInput, :credentialInput);

-- Create a new Gene --------------------
INSERT INTO MitoGenes (
    HgncID,
    HgncSymbol,
    HgncName,
    NCBIGeneID,
    UniProtID
)
VALUES
(:hgncIDInput, :hgncSymbolInput, :hgncNameInput, :NCBIGeneIDInput, :UniProtID);

-- Create a new Vector --------------------
INSERT INTO Vectors (
    ProductName,
    AntiBacterialID,
    VectorSize,
    RECutSites
)
VALUES
(:productNameInput, :antiBacterialIDSelection, :vectorSizeInput, :reCutSitesInput);

-- Create a new Chimera --------------------
INSERT INTO Chimeras (
    LabNotebookID,
    MitoGeneID,
    VectorID,
    ProviderName,
    DiseaseName
)
VALUES
(:newLabNotebookID, :mitoGeneSelection, :vectorSelection, :providerNameInput, :diseaseNameInput);

-- Create a new AntiBacterial --------------------
INSERT INTO AntiBacterials (
    AntiBacterialName
)
VALUES
(:antiBacterialNameInput);

-- Update an existing LabNotebook ----------------
UPDATE LabNotebooks
SET TransfectionComplete = :transfectionCompleteSelection,
    CompletionDate = :currentDateIfComplete,
    StorageFreezer = :storageFreezerSelection,
    FreezerBoxLoc = :freezerBoxLocInput
WHERE LabNotebookID = :activeLabNotebookID;

-- If new staff is added to the project
INSERT INTO ProjectStaff (
    ResearcherID,
    LabNotebookID
)
VALUES
(:researcherIDSelection, :activeLabNotebookID);

-- Delete an existing Researcher --------------------
DELETE FROM Researchers
    WHERE ResearcherID = :selectedResearcherID;

-- Filter ProjectStaff by Project --------------------
SELECT
PS.ProjectStaffID,
LN.SpecialProjectName,
CONCAT(R.FirstName," ", R.LastName) AS FullName
FROM ProjectStaff PS
    JOIN LabNotebooks LN
        ON LN.LabNotebookID = PS.LabNotebookID
    JOIN Researchers R
        ON R.ResearcherID = PS.ResearcherID
WHERE LN.SpecialProjectName = :selectedSpecialProjectName
ORDER BY FullName ASC;