function remove_ProjectStaff(projectStaffID, researcherID, labNotebookID) {
    // Put our data we want to send in a javascript object
    let data = {
        ProjectStaffID: projectStaffID,
        ResearcherID: researcherID,
        LabNotebookID: labNotebookID
    };
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/remove_project_staff", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Delete the data from the table
            deleteRow(projectStaffID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(projectStaffID){

    let table = document.getElementById("projectStaff-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == projectStaffID) {
            table.deleteRow(i);
            break;
       }
    }
}