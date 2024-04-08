<?php
include '../db.php' ;

$empId = $_GET['empid']; // Assuming you're using GET method to pass empid

// Fetch assigned locations
$query = "SELECT l.locationId, l.name, l.latitude, l.longitude FROM assignedLocation al INNER JOIN location l ON al.locationId = l.locationId WHERE al.empId = '$empId'";

$result = $conn->query($query);

$assignedLocations = array();
$response = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $assignedLocations[] = $row;
    }
    $response['status'] = 1;
    $response['locations'] = $assignedLocations;
} else {
    $response['status'] = 2;
    $response['message'] = 'No assigned locations found for the employee.';
}

// Close database connection
$conn->close();

// Return response in JSON format
header('Content-Type: application/json');
echo json_encode($response);
?>
