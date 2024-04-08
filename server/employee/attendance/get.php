<?php
include '../../db.php';
require_once '../../utils.php';

header('Content-Type: application/json');;

$headers = apache_request_headers();

if (!isset($headers['authorization'])) {
  http_response_code(401);
  // add message
  echo json_encode(array("message" => "Not authorized"));
  exit();
}

$empid = decodeJWT($headers['authorization'])['empid'];

if (!isset($_GET['month']) || !isset($_GET['year'])) {
  // error message in json format
  http_response_code(400);
  echo json_encode(array("message" => "month or year not received"));
  exit();
}

$month = $_GET['month']; // 1,2,3,4,5,6,7,8,9,10,11,12
$year = $_GET['year']; // '2021', '2020', ...

// get attendance record for the month and year, the row has a column date of type date

$query = "SELECT date, intime,outtime,inlocation,outlocation FROM attendance WHERE empid = '$empid' AND MONTH(date) = '$month' AND YEAR(date) = '$year'";

// status
// 0 -> error
// 1 -> success

try {
  if ($result = $conn->query($query)) {
    $response['status'] = 1;
    $response['message'] = "Attendance record fetched successfully";
    $response['records'] = $result->fetch_all(MYSQLI_ASSOC);
  } else {
    $response['status'] = 0;
    $response['message'] = "Error fetching attendance record";
  }
}
catch (Exception $e) {
  $response['status'] = 0;
  $response['message'] = "Error fetching attendance record";
} finally {
  $conn->close();
}

echo json_encode($response);
?>