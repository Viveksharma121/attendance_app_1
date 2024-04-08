<?php
// if url params has atribute admin then return hi

require_once 'logger.php';
$log->info('Unauthorized access', array('ip' => getClientIp()));

if (!isset($_GET['admin'])){
    echo json_encode(array('status' => 0, 'message' => "nice try!"));
    die();
} 