SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

CREATE OR REPLACE TABLE Researchers (
    ResearcherID int NOT NULL AUTO_INCREMENT,
    FirstName varchar(50) NOT NULL,
    LastName varchar(50) NOT NULL,
    Credential BOOLEAN,
    PRIMARY KEY (ResearcherID)
);

CREATE OR REPLACE TABLE MitoGenes (
    MitoGeneID int NOT NULL AUTO_INCREMENT,
    HgncID int,
    HgncSymbol varchar(10),
    HgncName varchar(100),
    NCBIGeneID int NOT NULL,
    UniProtID varchar(10),
    PRIMARY KEY (MitoGeneID)
);

CREATE OR REPLACE TABLE AntiBacterials (
    AntiBacterialID int NOT NULL AUTO_INCREMENT,
    AntiBacterialName varchar(50),
    PRIMARY KEY (AntiBacterialID)
);

CREATE OR REPLACE TABLE Vectors (
    VectorID int NOT NULL AUTO_INCREMENT,
    ProductName varchar(50) NOT NULL,
    AntiBacterialID int,
    VectorSize int,
    RECutSites varchar(100),
    PRIMARY KEY (VectorID),
    FOREIGN KEY (AntiBacterialID)
    REFERENCES AntiBacterials(AntiBacterialID)
    ON DELETE SET NULL
);

CREATE OR REPLACE TABLE LabNotebooks (
    LabNotebookID int NOT NULL AUTO_INCREMENT,
    SpecialProjectName varchar(100) UNIQUE,
    CreationDate datetime NOT NULL,
    TransfectionComplete tinyint,
    CompletionDate datetime,
    StorageFreezer tinyint,
    FreezerBoxLoc varchar(10),
    PRIMARY KEY (LabNotebookID)
);

CREATE OR REPLACE TABLE Chimeras (
    ChimeraID int NOT NULL AUTO_INCREMENT,
    LabNotebookID int,
    MitoGeneID int,
    VectorID int,
    ProviderName varchar(100),
    DiseaseName varchar(255),
    PRIMARY KEY (ChimeraID),
    FOREIGN KEY (LabNotebookID)
    REFERENCES LabNotebooks(LabNotebookID)
    ON DELETE SET NULL,
    FOREIGN KEY (MitoGeneID)
    REFERENCES MitoGenes(MitoGeneID)
    ON DELETE SET NULL,
    FOREIGN KEY (VectorID)
    REFERENCES Vectors(VectorID)
    ON DELETE SET NULL
);

CREATE OR REPLACE TABLE ProjectStaff (
    ProjectStaffID int NOT NULL AUTO_INCREMENT,
    ResearcherID int NOT NULL,
    LabNotebookID int NOT NULL,
    PRIMARY KEY (ProjectStaffID),
    FOREIGN KEY (ResearcherID)
    REFERENCES Researchers(ResearcherID)
    ON DELETE CASCADE,
    FOREIGN KEY (LabNotebookID) 
    REFERENCES LabNotebooks(LabNotebookID)
    ON DELETE CASCADE
);

INSERT INTO Researchers 
(
    FirstName,
    LastName,
    Credential
) 
VALUES 
('Nelson', 'Morales', TRUE),
('Ted', 'Terry', TRUE),
('Jamie', 'Garrett', TRUE);

INSERT INTO ProjectStaff
(
    ResearcherID,
    LabNotebookID
)
VALUES
(1, 1),
(2, 1),
(2, 2),
(3, 3),
(1, 3),
(3, 4);


INSERT INTO LabNotebooks
(
    SpecialProjectName,
    CreationDate,
    TransfectionComplete,
    CompletionDate,
    StorageFreezer,
    FreezerBoxLoc
)
VALUES
('SP001','2019/02/04 18:34:21',TRUE,'2020/08/12 14:46:12',1,'FB1-A3'),
('SP003','2020/08/05 3:25:27',TRUE,'2022/05/28 3:54:53',2,'FB4-H10'),
('SP004','2020/01/11 21:23:31',TRUE,'2021/08/25 3:41:28',1,'FB1-B3'),
('SP007','2022/06/23 20:57:49',FALSE,NULL,NULL,NULL);

INSERT INTO Chimeras
(
    LabNotebookID,
    MitoGeneID,
    VectorID,
    ProviderName,
    DiseaseName
)
VALUES
(4,1,2,'Kaiser Permanente','Mt-atp6-related Mitochondrial Spastic Paraplegia'),
(3,2,3,'Provider Inc.','MtDNA-Associated Leigh Syndrome (subacute necrotizing encephalomyelopathy)'),
(2,3,4,'Very Good Pharmaceuticals','Mitochondrial encephalomyopathy, lactic acidosis, and stroke-like episodes'),
(1,1,3,'Healthcare Co.','neurogenic muscle weakness, ataxia, and retinitis pigmentosa (NARP)');

INSERT INTO AntiBacterials
(
    AntiBacterialName
)
VALUES
('Chloramphenicol'),
('Kanamyacin'),
('Neomycin');

INSERT INTO Vectors
(
    ProductName,
    AntiBacterialID,
    VectorSize,
    RECutSites
)
VALUES
('pHSG 398 DNA',1,2227,'EcoRI, SacI, KpnI, SmaI, BamHI, XbaI, SalI, PstI, HindIII'),
('pHSG 396 DNA',1,2238,'EcoRI, EcoRII, EcoRV, SmaI, BamHI, XbaI, SalI, HindIII'),
('PSF-CMV-KAN',2,4245,'AscI, PacI, BgiI, XhoI, EcoRI, EcoRV, BalI, BseRI, BsgI'),
('PSF-CAG-KAN',2,5358,'PacI, BgiI, XhoI, SmaI, BamHI, XbaI, SalI, HindIII');

INSERT INTO MitoGenes
(
    HgncID,
    HgncSymbol,
    HgncName,
    NCBIGeneID,
    UniProtID
)
VALUES
(7414,'MT-ATP6','mitochondrially encoded ATP synthase membrane subunit 6',4508,'P00846'),
(7461,'MT-ND5','mitochondrially encoded NADH:ubiquinone oxidoreductase core subunit 5',4540,'P03915'),
(7490,'MT-TL1','mitochondrially encoded tRNA-Leu (UUA/G) 1',4567,NULL)
;

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;