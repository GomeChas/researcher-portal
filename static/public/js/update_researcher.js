

let updateResearcher = document.getElementById('update_researcher_form');

updateResearcher.addEventListener("submit", function (e) {
    e.preventDefault();

    console.log(`Update Researcher form submitted.`)

    let inputResearcherId = document.getElementById("selectResearcherUpdate");
    let inputCredentialUpdateTrue = document.getElementById("updateCredentialTrue");
    let inputCredentialUpdateFalse = document.getElementById("updateCredentialFalse")

    let researcherIdValue = inputResearcherId.value;
    if (inputCredentialUpdateTrue.checked){
        credentialUpdateValue = 1
    }
    if (inputCredentialUpdateFalse.checked){
        credentialUpdateValue = 0
    }
    let inputCredentialUpdate = credentialUpdateValue

    if (isNaN(credentialUpdateValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        researcherId: researcherIdValue,
        credential: credentialUpdateValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-researcher-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log('Adding new data to table.')
            // Add the new data to the table
            updateRow(xhttp.response, researcherIdValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, researcherID){
    let parsedData = JSON.parse(data);
    console.log(parsedData)
    
    let table = document.getElementById("researchers-table");

    console.log(`researcherID: ${researcherID}`)
    for (let i = 0, row; row = table.rows[i]; i++) {
        console.log(`Data Value: ${table.rows[i]}`)
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == researcherID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].Credential; 
       }
    }
}