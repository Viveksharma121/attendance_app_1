<?php
include '../../db.php' ;

$locationid = $data['locationid'];

// delete location

$query = "DELETE FROM location WHERE locationid = '$locationid'";
if ($conn->query($query) === TRUE) {
    $response['status'] = 1;
    $response['message'] = "Location deleted successfully.";
} else {
    $response['status'] = 0;
    $response['message'] = $conn->error;
}

// Close database connection
$conn->close();

// Return response in JSON format
header('Content-Type: application/json');
echo json_encode($response);
?>