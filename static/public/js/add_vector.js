let addVector = document.getElementById('add_new_vector');

addVector.addEventListener("submit", function(e) {
    e.preventDefault();

    let inputProductName = document.getElementById('productName');
    let inputAntiBacterialID = document.getElementById('antiBacterialID');
    let inputVectorSize = document.getElementById('vectorSize');
    let inputRECutSites = document.getElementsByName('reCutSite');

    let ProductNameValue = inputProductName.value;
    let AntiBacterialIDValue = inputAntiBacterialID.value;
    let VectorSizeValue = inputVectorSize.value;

    let RECutSitesValue = '';
    for (let i = 0; i < inputRECutSites.length; i++) {
        if (inputRECutSites[i].checked == true && i==0) {
            let newRECutSite = inputRECutSites[i].value
            RECutSitesValue += `${newRECutSite}`;
        }
        else if (inputRECutSites[i].checked == true) {
            let newRECutSite = inputRECutSites[i].value
            RECutSitesValue += `, ${newRECutSite}`;
        }
    };

    let data = {
        ProductName: ProductNameValue,
        AntiBacterialID: AntiBacterialIDValue,
        VectorSize: VectorSizeValue,
        RECutSites: RECutSitesValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_new_vector", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            addRowToTable(xhttp.response);

            inputProductName.value = '';
            inputAntiBacterialID.value = '';
            inputVectorSize.value = '';
            for (let i = 0; i < inputRECutSites.length; i++) {
                inputRECutSites[i].checked = false;
            };
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with input")
            }
        }
    xhttp.send(JSON.stringify(data));
})

addRowToTable = (data) => {
    let currentTable = document.getElementById("vector-table");

    let newRowIndex = currentTable.rows.length;

    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    let row = document.createElement("TR");
    let ProductNameCell = document.createElement("td");
    let AntiBacIDCell = document.createElement("td");
    let VectorSizeCell = document.createElement("td");
    let RECutSitesCell = document.createElement("td");

    ProductNameCell.innerText = newRow.ProductName;
    AntiBacIDCell.innerText = newRow.AntiBacterialID;
    VectorSizeCell.innerText = newRow.VectorSize;
    RECutSitesCell.innerText = newRow.RECutSites;

    row.appendChild(ProductNameCell);
    row.appendChild(AntiBacIDCell);
    row.appendChild(VectorSizeCell);
    row.appendChild(RECutSitesCell);
    currentTable.appendChild(row);
}