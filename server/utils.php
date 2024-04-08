<?php
require __DIR__ . '/vendor/autoload.php'; // Include the Composer autoloader

use Firebase\JWT\JWT;
use Firebase\JWT\Key;


function decodeJWT($token) {
$key = "nkan*&*Giuugq8oy891}{>***#@ed";

    try {
        $decoded = (array) JWT::decode($token, new Key($key, 'HS256')); 
        return $decoded;
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

function encodeJWT($token) {
$key = "nkan*&*Giuugq8oy891}{>***#@ed";

    try {
        $encoded = JWT::encode($token, $key, 'HS256'); 
        return $encoded;
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

