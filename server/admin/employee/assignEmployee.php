<?php

include '../../db.php' ;

$employeeid = $data['employeeid'];
$managerid = $data['managerid'];

try {
 
  $query = "INSERT INTO manager (employeeid, managerid) VALUES ('$employeeid', '$managerid')";
  if ($conn->query($query) === TRUE) {
      $response['status'] = 1;
      $response['message'] = "Employee assigned successfully.";
  } else {
      $response['status'] = 0;
      $response['message'] = $conn->error;
  }
 
} catch (Exception $e) {
  $response['status'] = 0;
  $response['message'] = $e->getMessage();
}

$conn->close();

// Return response in JSON format
header('Content-Type: application/json');
echo json_encode($response);
?>