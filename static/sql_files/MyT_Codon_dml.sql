-- List all LabNotebooks on the home page with the associated Researchers' names
SELECT
a.Project_Staff,
C.ProviderName,
C.DiseaseName,
LN.CreationDate,
LN.TransfectionComplete,
LN.CompletionDate,
LN.StorageFreezer,
LN.FreezerBoxLoc
FROM (
    SELECT
        b.LabNotebookID,
        GROUP_CONCAT(Name) AS Project_Staff
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
;
-- List all Researchers on the Researchers page
SELECT
FirstName AS `First Name`,
LastName AS `Last Name`,
Credential AS `Active Credential`
FROM Researchers
;
-- List all MitoGenes on the Genes page
SELECT
HgncID AS `HGNC ID`,
HgncSymbol AS `HGNC Symbol`,
HgncName AS `HGNC Name`,
NCBIGeneID AS `NCBI ID`,
UniProtID AS `UniProt ID`
FROM MitoGenes
;
-- List all Vectors on the Vectors page with the AntiBacterial name
SELECT
ProductName AS `Product Name`,
AB.AntiBacterialName AS `AntiBacterial Selection`,
VectorSize AS `Vector Size`,
RECutSites AS `Restriction Enzymes`
FROM Vectors V
    INNER JOIN AntiBacterials AB
        ON AB.AntiBacterialID = V.AntiBacterialID
;
-- List all Chimeras on the Chimeras page
SELECT
MG.HgncSymbol AS `Mitochondrial Gene`,
V.ProductName AS `Vector Used`,
ProviderName AS `Provider Name`,
DiseaseName AS `Disease/Phenotype`
FROM Chimeras C
    INNER JOIN MitoGenes MG
        ON MG.MitoGeneID = C.MitoGeneID
    INNER JOIN Vectors V
        ON V.VectorID = C.VectorID
;

-- List all AntiBacterials on the AntiBacterials page
SELECT
AntiBacterialName AS `AntiBacterial Name`
FROM AntiBacterials;

-- For the following INSERT functionalities, the colon : character will be used to denote variables

-- Create a new LabNotebook --------------------
INSERT INTO LabNotebooks(
    CreationDate,
    TransfectionComplete,
    CompletionDate,
    StorageFreezer,
    FreezerBoxLoc
)
VALUES
(:currentDate, 0, NULL, :storageFreezerInput, :freezerBoxLocInput);

-- When creating a new LabNotebook, a ProjectStaff entry will be created for each staff member selected
INSERT INTO ProjectStaff (
    ResearcherID,
    LabNotebookID
)
VALUES
(:researcherIDSelection, :newLabNotebookID);

-- Creating a LabNotebook also creates a Chimera
INSERT INTO Chimeras (
    LabNotebookID,
    MitoGeneID,
    VectorID,
    ProviderName,
    DiseaseName
)
VALUES
(:newLabNotebookID, :mitoGeneSelection, :vectorSelection, :providerNameInput, :diseaseNameInput);

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

-- Search for an existing Researcher --------------------
SELECT
FirstName AS `First Name`,
LastName AS `Last Name`,
Credential AS `Active Credential`
FROM Researchers
WHERE FirstName = :searchInput
    OR LastName = :searchInput
ORDER BY ResearcherID ASC;