<?php

include '../../db.php' ;
//delete assigned employee
$employeeid = $data['employeeid'];
$managerid = $data['managerid'];

// delete location
try{
  $query = "DELETE FROM manager WHERE employeeid = '$employeeid' AND managerid = '$managerid'";
  if ($conn->query($query) === TRUE) {
      $response['status'] = 1;
      $response['message'] = "Employee deleted successfully.";
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