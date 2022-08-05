let addResearcher = document.getElementById('add_new_researcher');

addResearcher.addEventListener("submit", function(e) {
    e.preventDefault();

    let inputFirstName = document.getElementById('FirstName');
    let inputLastName = document.getElementById('LastName');
    let inputCredential = document.getElementById('Credential');

    let FirstNameValue = inputFirstName.value;
    let LastNameValue = inputLastName.value;
    let CredentialValue = inputCredential.value;


    let data = {
        FirstName: FirstNameValue,
        LastName: LastNameValue,
        Credential: CredentialValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_new_researcher", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            addRowToTable(xhttp.response);

            inputFirstName.value = '';
            inputLastName.value = '';
            inputCredential.value = 'Yes';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with input")
            }
        }
    xhttp.send(JSON.stringify(data));
})

addRowToTable = (data) => {
    let currentTable = document.getElementById("researchers-table");

    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    let row = document.createElement("tr");
    let ResearcherIDCell = document.createElement("td")
    let FirstNameCell = document.createElement("td");
    let LastNameCell = document.createElement("td");
    let CredentialCell = document.createElement("td");
    let DeleteCell = document.createElement("td");

    let DeleteCellButton = document.createElement("button");

    ResearcherIDCell.innerText = newRow.ResearcherID;
    FirstNameCell.innerText = newRow.FirstName;
    LastNameCell.innerText = newRow.LastName;
    CredentialCell.innerText = newRow.Credential;

    DeleteCellButton.innerHTML = "<i class='fa-solid fa-trash'></i>";
    DeleteCellButton.onclick = function() {
        deleteResearcher(newRow.ResearcherID);
    };
    DeleteCell.appendChild(DeleteCellButton);
    
    row.appendChild(ResearcherIDCell);
    row.appendChild(FirstNameCell);
    row.appendChild(LastNameCell);
    row.appendChild(CredentialCell);
    row.appendChild(DeleteCell);

    row.setAttribute('data-value', newRow.ResearcherID);

    currentTable.appendChild(row);
}