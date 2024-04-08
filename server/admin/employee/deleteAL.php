<?php
//delete addigned location
include '../../db.php' ;

$empid = $data['empid'];
$locationid = $data['locationid'];

// delete location
try{
  $query = "DELETE FROM assignedlocation WHERE empid = '$empid' AND locationid = '$locationid'";
  if ($conn->query($query) === TRUE) {
      $response['status'] = 1;
      $response['message'] = "Location deleted successfully.";
  } else {
      $response['status'] = 0;
      $response['message'] = $conn->error;
  }
}
catch(Exception $e){
    $response['status'] = 0;
    $response['message'] = $e->getMessage();
}

// Close database connection
$conn->close();

// Return response in JSON format
header('Content-Type: application/json');
echo json_encode($response);
?>