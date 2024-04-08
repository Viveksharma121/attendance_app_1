<?php
include '../../db.php';
require_once '../../utils.php';

header('Content-Type: application/json');;

$headers = apache_request_headers();

if (!isset($headers['authorization'])) {
    http_response_code(401);
    exit();
}

$empid = decodeJWT($headers['authorization'])['empid'];

if (!isset($data['lat']) || !isset($data['lon'])) {
    // error message in json format
    http_response_code(400);
    echo json_encode(array("message" => "coordinates not received"));
    exit();
}

$lat = $data['lat'];
$lon = $data['lon'];


$curl = curl_init();

$reqUrl = "https://revgeocode.search.hereapi.com/v1/revgeocode?apiKey=xBdDcCu7jyssxg4qRL_gJee1JX-qxrdOCanJePTUxmY&at={$lat},{$lon}";

curl_setopt_array($curl, array(
    CURLOPT_URL => $reqUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'GET',
));

$res = json_decode(curl_exec($curl), true);

curl_close($curl);

$response = array();

$address = $res['items'][0]['address']['label'];
$address = substr($address,0, 290);
// $markedByEmployee = 1; // should be 1 or 0

// get attendance record
$checkState = "SELECT * FROM attendance WHERE empid = '$empid' AND date = CURDATE()";

try {

    $checkResult = $conn->query($checkState);

    if ($checkResult->type === "error") {
        // http_response_code(500);
        $response['message'] = $conn->error;
        $response['status'] = 2;
        echo json_encode($response);
        exit();
    }

    /*
    status = 0 -> already punched out
    status = 1 -> punched out
    status = 2 -> error
    */
    if ($checkResult->num_rows === 0) {
        $response['status'] = 2;
        $response['message'] = "Not punched in yet.";
        echo json_encode($response);
        $conn->close();
        exit();
    } elseif ($checkResult->fetch_assoc()['outtime'] !== null) {
        $response['status'] = 0;
        $response['message'] = "Punched out already for the day.";
        echo json_encode($response);
        $conn->close();
        exit();
    }



    $query = "UPDATE attendance SET outtime = CURRENT_TIME(), outlocation=\"$address\", outlocationlon=$lon, outlocationlat=$lat  WHERE empid = '$empid' AND date = CURDATE()";

    if ($conn->query($query) === TRUE) {
        $response['status'] = 1;
        $response['message'] = "Punched Out Successfully.";
    } else {
        $response['message'] = $conn->error;
        // http_response_code(500);
    }
} catch (\Throwable $th) {
    $response['status'] = 2;
    $response['message'] = $th->getMessage();
    $response['error'] = $query;
}

// Close database connection
$conn->close();

echo json_encode($response);
