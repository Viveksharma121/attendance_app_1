<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://revgeocode.search.hereapi.com/v1/revgeocode?apiKey=xBdDcCu7jyssxg4qRL_gJee1JX-qxrdOCanJePTUxmY&at=37.422,-122.084',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
));

$response = json_decode(curl_exec($curl),true);

curl_close($curl);   


// header('Content-Type: application/json');
echo $response['items'][0]['address']['label'];
