let addGene = document.getElementById('add_new_gene');

addGene.addEventListener("submit", function(e) {
    e.preventDefault();

    let inputHgncID = document.getElementById('hgnc_id');
    let inputHgncSymbol = document.getElementById('hgnc_symbol');
    let inputHgncName = document.getElementById('hgnc_name');
    let inputNCBIGeneID = document.getElementById('ncbi_id');
    let inputUniProtID = document.getElementById('uniprot_id');

    let HgncIDValue = inputHgncID.value;
    let HgncSymbolValue = inputHgncSymbol.value;
    let HgncNameValue = inputHgncName.value;
    let NCBIGeneIDValue = inputNCBIGeneID.value;
    let UniProtIDValue = inputUniProtID.value;


    let data = {
        HgncID: HgncIDValue,
        HgncSymbol: HgncSymbolValue,
        HgncName: HgncNameValue,
        NCBIGeneID: NCBIGeneIDValue,
        UniProtID: UniProtIDValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_new_gene", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            addRowToTable(xhttp.response);

            inputHgncID.value = '';
            inputHgncSymbol.value = '';
            inputHgncName.value = '';
            inputNCBIGeneID.value = '';
            inputUniProtID.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with input")
            }
        };
    xhttp.send(JSON.stringify(data));
})

addRowToTable = (data) => {
    let currentTable = document.getElementById("gene-table");

    let newRowIndex = currentTable.rows.length;

    let newRow = JSON.parse(data);

    let row = document.createElement("TR");
    let HgncIDCell = document.createElement("td");
    let HgncSymbolCell = document.createElement("td");
    let HgncNameCell = document.createElement("td");
    let NCBIGeneIDCell = document.createElement("td");
    let UniProtIDCell = document.createElement("td");

    HgncIDCell.innerText = newRow.HgncID;
    HgncSymbolCell.innerText = newRow.HgncSymbol;
    HgncNameCell.innerText = newRow.HgncName;
    NCBIGeneIDCell.innerText = newRow.NCBIGeneID;
    UniProtIDCell.innerText = newRow.UniProtID;

    row.appendChild(HgncIDCell);
    row.appendChild(HgncSymbolCell);
    row.appendChild(HgncNameCell);
    row.appendChild(NCBIGeneIDCell);
    row.appendChild(UniProtIDCell);
    currentTable.appendChild(row);
}