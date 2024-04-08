<?php
include '../../db.php';

$name = $data['name'];
$latitude = $data['latitude'];
$longitude = $data['longitude'];

// Check connection
if ($conn->connect_error) {
  echo json_encode(array('status' => 0, 'message' => 'Connection failed.'));
  die("Connection failed: " . $conn->connect_error);
}

// Initialize response array
$response = array();

$query = "INSERT INTO location (name, latitude, longitude) VALUES ('$name', '$latitude', '$longitude')";
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
  $query = "SELECT * FROM location";
  $result1 = $conn->query($query);
  if (!$result1) {
    $response['status'] = 0;
    $response['message']  = $conn->error;
    echo json_encode($response);
    die();
  } 
  $locations = array();
  while ($row = $result1->fetch_assoc()) {
      $locations[] = $row;
  }
  $response['status'] = 1;
  $response['locations'] = $locations;
  $response['message'] = "Location created successfully.";
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
