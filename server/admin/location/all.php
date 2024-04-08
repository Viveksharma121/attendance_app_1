<?php
include '../../db.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
  echo json_encode(array('status' => 0, 'message' => 'Connection failed.'));
  die("Connection failed: " . $conn->connect_error);
}

// Initialize response array
$response = array();

$query = "SELECT * FROM location";
$result = $conn->query($query);

if (!$result) {
  $response['status'] = 0;
  $response['message']  = $conn->error;
  echo json_encode($response);
  die();
}

// if ($result->num_rows == 0) {
  $locations = array();
  while ($row = $result->fetch_assoc()) {
      $locations[] = $row;

  }   
  $response['locations'] = $locations;
  $response['status'] = 1; 
// }

// Close database connection
$conn->close();

// Return response in JSON format
header('Content-Type: application/json');
echo json_encode($response);
?>
