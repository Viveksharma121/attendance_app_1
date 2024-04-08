<?php
include '../../db.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
  echo json_encode(array('status' => 0, 'message' => 'Connection failed.'));
}

// Initialize response array
$response = array();

$query = "SELECT empid,name,email FROM employee";
$result = $conn->query($query);

if ($result->num_rows == 0) {
    $response['status'] = 2; // empid doesn't exist in the database
    $response['message'] = "No employees Added";
} else {
  while ($row = $result->fetch_assoc()) {
      $response[] = $row;
  }   
  // $response['status'] = 1; 
}

// Close database connection
$conn->close();

// Return response in JSON format
header('Content-Type: application/json');
echo json_encode($response);
?>
