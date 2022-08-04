function deleteResearcher(researcherID) {
    // Put our data we want to send in a javascript object
    let data = {
        ResearcherID: researcherID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-researcher", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Delete the data from the table
            deleteRow(researcherID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(researcherID){

    let table = document.getElementById("researchers-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == researcherID) {
            table.deleteRow(i);         
            break;
       }
    }
    let selectMenu = document.getElementById("selectResearcherUpdate");
    for (let i = 0; i < selectMenu.length; i++) {
        if (selectMenu[i].value == researcherID) {
            selectMenu.remove(i);
        }
    }
}