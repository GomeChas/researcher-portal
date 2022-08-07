let updateResearcher = document.getElementById('update_researcher_form');

updateResearcher.addEventListener("submit", function (e) {
    e.preventDefault();

    let inputResearcherId = document.getElementById("selectResearcherUpdate");
    let inputCredential = document.getElementById("updateCredential");

    let researcherIdValue = inputResearcherId.value;
    let credentialValue = inputCredential.value;


    // Put our data we want to send in a javascript object
    let data = {
        researcherId: researcherIdValue,
        credential: credentialValue,
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-researcher", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            updateRow(xhttp.response, researcherIdValue);

            inputResearcherId.value = "--Please choose an option--";
            inputCredential.value = "Yes";

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

    let table = document.getElementById("researchers-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == researcherID) {

            // Get the location of the row where we found the matching ResearcherID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of researcher value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign credential to our value we updated to
            td.innerText = parsedData.credential; 
       }
    }
}