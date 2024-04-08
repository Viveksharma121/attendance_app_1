<?php
include '../../db.php' ;

$empid = $data['empid']; // Assuming you're using GET method to pass empid

// Fetch assigned locations
try {
  //code...

  $query = "SELECT l.locationid, l.name, l.latitude, l.longitude FROM assignedLocation al INNER JOIN location l ON al.locationId = l.locationId WHERE al.empid = '$empid'";
  $result = $conn->query($query);
  $assignedLocations = array();
  $response = array();

  if ($result->num_rows > 0) {
      while ($row = $result->fetch_assoc()) {
          $assignedLocations[] = $row;
      }
      // $response['status'] = 1;
      $response['locations'] = $assignedLocations;
  } else {
      // $response['status'] = 2;
      // $response['message'] = 'No assigned locations found for the employee.';
  }

  // now get employee data

  $query = "SELECT * FROM employee WHERE empid = '$empid'";
  $result = $conn->query($query);
  $employee = array();
  // $response = array();

  if ($result->num_rows > 0) {
      // while ($row = $result->fetch_assoc()) {
          $employee = $result->fetch_assoc();
      // }
      // $response['status'] = 1;
      $response['employee'] = $employee;
  } else {
      // $response['status'] = 2;
      // $response['message'] = 'No employee found.';
  }

  // now get assigned employees

  $query = "SELECT e.empid, e.name FROM manager ae INNER JOIN employee e ON ae.employeeid = e.empid WHERE ae.managerid = '$empid'";
  $result = $conn->query($query);
  $assignedEmployees = array();
  // $response = array();

  if ($result->num_rows > 0) {
      while ($row = $result->fetch_assoc()) {
          $assignedEmployees[] = $row;
      }
      // $response['status'] = 1;
      $response['employees'] = $assignedEmployees;
  } else {
      // $response['status'] = 2;

      // $response['message'] = 'No assigned employees found for the manager.';
  }

//   now get assigned manager

  $query = "SELECT e.empid, e.name FROM manager ae INNER JOIN employee e ON ae.managerid = e.empid WHERE ae.employeeid = '$empid'";

  $result = $conn->query($query);
  $assignedManager = array();

  if ($result->num_rows > 0) {
      while ($row = $result->fetch_assoc()) {
          $assignedManager[] = $row;
      }
      // $response['status'] = 1;
      $response['manager'] = $assignedManager;
  } else {
      // $response['status'] = 2;
      // $response['message'] = 'No assigned manager found for the employee.';
  }
  $response['status'] = 1;
} catch (\Exception $e) {
  $response['status'] = 0;
  $response['message'] = $e->getMessage();
//   echo json_encode($response);
//   die();
}

// Close database connection
$conn->close();

// Return response in JSON format
header('Content-Type: application/json');
echo json_encode($response);

?>