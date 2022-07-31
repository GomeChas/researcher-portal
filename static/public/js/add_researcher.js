let addResearcher = document.getElementById('add_new_researcher');

addResearcher.addEventListener("submit", function(e) {
    e.preventDefault();

    let inputFirstName = document.getElementById('FirstName');
    let inputLastName = document.getElementById('LastName');
    let inputCredential = document.getElementsByName('Credential');

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
            inputCredential.value = '';
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

    let row = document.createElement("TR");
    let FirstNameCell = document.createElement("td");
    let LastNameCell = document.createElement("td");
    let CredentialCell = document.createElement("td");
    let UpdateCell = document.createElement("td");
    let DeleteCell = document.createElement("td");

    FirstNameCell.innerText = newRow.FirstName;
    LastNameCell.innerText = newRow.LastName;
    CredentialCell.innerText = newRow.Credential;
    UpdateCell.insertAdjacentHTML("afterbegin", "<a href='#'>Edit</a>");
    DeleteCell.insertAdjacentHTML("afterbegin", "<a href='#' onClick='confirm(`This will remove the researcher. Are you sure you wish to delete?`);'>Delete</a>");

    row.appendChild(FirstNameCell);
    row.appendChild(LastNameCell);
    row.appendChild(CredentialCell);
    row.appendChild(UpdateCell);
    row.appendChild(DeleteCell);

    currentTable.appendChild(row);
}