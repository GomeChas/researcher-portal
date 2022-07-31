let addAntiBacterial = document.getElementById('add_new_antibacterial');

addAntiBacterial.addEventListener("submit", function(e) {
    e.preventDefault();

    let inputAntiBacName = document.getElementById('AntiBacterialName');
    let AntiBacNameValue = inputAntiBacName.value;

    let data = {
        AntiBacterialName: AntiBacNameValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_new_antibacterial", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            addRowToTable(xhttp.response);

            inputAntiBacName.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with input")
            }
        }
    xhttp.send(JSON.stringify(data));
})

addRowToTable = (data) => {
    let currentTable = document.getElementById("antibacterial-table");

    let newRowIndex = currentTable.rows.length;

    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    let row = document.createElement("TR");
    let AntiBacNameCell = document.createElement("td");

    AntiBacNameCell.innerText = newRow.AntiBacterialName;

    row.appendChild(AntiBacNameCell);
    currentTable.appendChild(row);
}