<?php
$servername = "localhost";
$username = "root";
$password = "1234";
$database = "attendance";

$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    echo json_encode(array('status' => 0, 'message' => $conn->connect_error));
    die("Connection failed: " . $conn->connect_error);
}

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);
