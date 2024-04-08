assign location by inserting locationid and empid in assignedlocation table
<?php

include '../../db.php' ;

$locationid = $data['locationid'];
$empid = $data['empid'];

// delete location
try{
  $query = "INSERT INTO assignedlocation (locationid, empid) VALUES ('$locationid', '$empid')";
  if ($conn->query($query) === TRUE) {
      $response['status'] = 1;
      $response['message'] = "Location assigned successfully.";
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