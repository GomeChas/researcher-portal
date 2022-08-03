let addResearcher = document.getElementById('add_new_researcher');

addResearcher.addEventListener("submit", function(e) {
    e.preventDefault();

    let inputFirstName = document.getElementById('firstName');
    let inputLastName = document.getElementById('lastName');
    let inputCredentialTrue = document.getElementById('credentialTrue');
    let inputCredentialFalse = document.getElementById('credentialFalse');

    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    if (inputCredentialTrue.checked){
        credentialValue = 1
    }
    if (inputCredentialFalse.checked){
        credentialValue = 0
    }
    let inputCredential = credentialValue

    let data = {
        FirstName: firstNameValue,
        LastName: lastNameValue,
        Credential: credentialValue
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
    //let UpdateCell = document.createElement("td");
    let DeleteCell = document.createElement("td");

    FirstNameCell.innerText = newRow.FirstName;
    LastNameCell.innerText = newRow.LastName;
    CredentialCell.innerText = newRow.Credential;
    //UpdateCell.insertAdjacentHTML("afterbegin", "<a href='#'>Edit</a>");
    DeleteCell.insertAdjacentHTML("afterbegin", `<button onclick="deleteResearcher(${newRow.ResearcherID})">Delete</button>`);

    row.appendChild(FirstNameCell);
    row.appendChild(LastNameCell);
    row.appendChild(CredentialCell);
    //row.appendChild(UpdateCell);
    row.appendChild(DeleteCell);

    row.setAttribute('data-value', newRow.ResearcherID);

    currentTable.appendChild(row);

    let selectMenu = document.getElementById("selectResearcherUpdate");
    let option = document.createElement("option");
    option.text = newRow.FirstName + ' ' +  newRow.LastName;
    option.value = newRow.ResearcherID;
    selectMenu.add(option);
}