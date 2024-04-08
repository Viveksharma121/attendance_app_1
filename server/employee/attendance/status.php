<?php
include '../../db.php' ;
require_once '../../utils.php';

if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    // Method not allowed
    http_response_code(405);
    exit();
}

$headers = apache_request_headers();

if (!isset($headers['authorization'])) {
    http_response_code(401);
    exit();
}

$empid = decodeJWT($headers['authorization'])['empid'];

// // Check attendance status for the given day
$query = "SELECT * FROM attendance WHERE empid = '$empid' AND date = CURDATE()";
$result = $conn->query($query);

/*
status = 0 -> No attendance marked for the day
status = 1 -> punched in
status = 2 -> punched out
*/

if ($result->num_rows === 0) {
    $response['status'] = 0; // No attendance marked for the day
} else {
    $row = $result->fetch_assoc();
    $outTime = $row['outtime'];

    if ($outTime === null) {
        $response['status'] = 1; // Attendance marked but outTime is null
    } else {
        $response['status'] = 2; // outTime is not null
    }
// send result in json
    $response['data'] = $row;
}

// // Close database connection
$conn->close();

// // Return response in JSON format
header('Content-Type: application/json');
echo json_encode($response);
// ?>
