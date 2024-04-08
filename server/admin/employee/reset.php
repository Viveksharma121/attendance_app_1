<?php
  include '../../db.php' ;
  $empid = $data['empid'];

  // in employee table update device if value to null
  try{
    $query = "UPDATE employee SET deviceid = NULL WHERE empid = '$empid'";
    if ($conn->query($query) === TRUE) {
        $response['status'] = 1;
        $response['message'] = "Employee reset successfully.";
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