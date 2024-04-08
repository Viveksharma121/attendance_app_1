<?php
include './db.php';
require_once './utils.php';

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    // Method not allowed
    http_response_code(405);
    exit();
}
if (!isset($data['empid']) || !isset($data['deviceid'])) {
    // error message in json format
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(array("message" => "Data not received"));


    exit();
}

$empid = $data['empid'];
$deviceId = $data['deviceid'];

// Initialize response array
$response = array();

try {
    // Check if empid exists in the database
    $query = "SELECT * FROM employee WHERE empid = '$empid'";
    $result = $conn->query($query);

    // status = 1 -> empid and deviceid match
    // status = 2 -> empid is valid but deviceid in the database is null i.e. fist time login
    // status = 3 -> empid is valid but deviceid doesn't match
    // status = 4 -> empid doesn't exist in the database
    // status = 5 -> admin login

    //post
    // 0 -> employee
    // 1 -> manager
    // 2 -> admin

    if ($result->num_rows == 0) {
        $response['status'] = 4; // empid doesn't exist in the database
        $response['message'] = "Employee ID doesn't exist.";
    } else {

        $row = $result->fetch_assoc();
        $storedDeviceId = $row['deviceId'];

        if ($row['post'] == 2) {
            if ($storedDeviceId == $deviceId || $storedDeviceId == null) {
                if ($storedDeviceId == null) {
                    $query = "UPDATE employee SET deviceId = '$deviceId' WHERE empid = '$empid'";
                    $conn->query($query);
                }
                $response['status'] = 5;
                $response['token'] = encodeJWT(array(
                    "empid" => $empid
                ));
            } else {
                $response['status'] = 3;
                $response['message'] = "Device ID doesn't match.";
            }
        } elseif ($storedDeviceId == null) {
            $response['status'] = 2; // empid is valid but deviceid in the database is null
            $response['message'] = "First time login.";
            // $response['token'] = encodeJWT(array(
                // "empid" => $empid
            // ));
        } elseif ($deviceId == $storedDeviceId) {
            $token = array(
                "empid" => $empid,
            );

            // $jwt = JWT::encode($token, $key,'HS256'); // Encode token using the HMAC SHA-256 algorithm
            $jwt = encodeJWT($token);
            $response['status'] = 1; // empid and deviceid match
            // $dec = decodeJWT($jwt);

            // Include all attributes from the employee table
            $response['empid'] = $row['empid'];
            $response['name'] = $row['name'];
            $response['email'] = $row['email'];
            $response['token'] = $jwt;
            // $temp = (array) $dec;
            // $response['dec'] = $temp['empid'];
        } else {
            $response['status'] = 3; // empid is valid but deviceid doesn't match
            $response['message'] = "Device ID doesn't match.";
        }
    }
} catch (\Throwable $th) {
    $response['status'] = 4;
    $response['message'] = $th->getMessage();
} finally {
    // Close database connection
    $conn->close();
}

// Return response in JSON format
header('Content-Type: application/json');
echo json_encode($response);
