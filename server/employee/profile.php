<?php
include '../db.php' ;

$empid = $data['empid'];
// Update employee information
// $query = "UPDATE employee SET name = '$name', email = '$email', lastUpdatedLocationX = '$coordX', lastUpdatedLocationY = '$coordY' WHERE empid = '$empid'";
$response = array();

$query = "SELECT empid, name, email, isManager FROM employee WHERE empid = '$empid'";
$result = $conn->query($query);
if ($result->num_rows != 0) {
  $response = $result->fetch_assoc();
  $response['status'] = 1;
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
