<?php
include '../../db.php';

$empid = $data['empid'];

// Initialize response array
$response = array();

$query = "INSERT INTO employee (empid) VALUES ('$empid')";
try {
  $result = $conn->query($query);

} catch (Exception $e) {
  $response['status'] = 0;
  $response['message'] = $e->getMessage();
  echo json_encode($response);
  die();
}

if (!$result) {
  $response['status'] = 0;
  $response['message']  = $conn->error;
  echo json_encode($response);
  die();
}

if ($result) {
  $query = "SELECT name,empid FROM employee";
  $result1 = $conn->query($query);
  if (!$result1) {
    $response['status'] = 0;
    $response['message']  = $conn->error;
    echo json_encode($response);
    die();
  } 
  $employees = array();
  while ($row = $result1->fetch_assoc()) {
      $employees[] = $row;
  }
  $response['status'] = 1;
  $response['employees'] = $employees;
  $response['message'] = "Employee created successfully.";
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