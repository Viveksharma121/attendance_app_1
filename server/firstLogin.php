<?php
include './db.php';
require_once './utils.php';

header('Content-Type: application/json');


if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    // Method not allowed
    http_response_code(405);
    exit();
}

$not_received = array();

if (!isset($data['empid'])) {
    $not_received[] = "empid";
}

if (!isset($data['name'])) {
    $not_received[] = "name";
}

if (!isset($data['email'])) {
    $not_received[] = "email";
}

if (!isset($data['deviceid'])) {
    $not_received[] = "deviceid";
}

if (count($not_received) > 0) {
    // error message in json format
    http_response_code(400);
    $message = "Not received " . join(', ', $not_received);
    echo json_encode(array("message" => $message));
    exit();
}



$empid = $data['empid'];
$name = $data['name'];
$email = $data['email'];
$deviceId = $data['deviceid'];

// Update employee information
// $query = "UPDATE employee SET name = '$name', email = '$email', lastUpdatedLocationX = '$coordX', lastUpdatedLocationY = '$coordY' WHERE empid = '$empid'";
$query = "UPDATE employee SET name = '$name', email = '$email', deviceid = '$deviceId' WHERE empid = '$empid'";

$response = array();


try {
    if ($conn->query($query) === TRUE) {
        $response['status'] = 1;
        $response['token'] = encodeJWT(array("empid" => $empid));
    } else {
        // http_response_code(500);
        $response['message'] = $conn->error;
    }
} catch (\Throwable $th) {
    // http_response_code(500);
    echo json_encode(array("message" => "Internal Server Error"));
} finally {
    $conn->close();
}

// Return response in JSON format
echo json_encode($response);
