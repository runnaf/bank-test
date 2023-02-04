<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, HEAD');
header('Access-Control-Allow-Headers: Access-Control-Allow-Methods, Access-Control-Allow-Origin, Allow');

$request = file_get_contents('php://input');
$data = json_decode($request, true);

if(!$data) {
  echo false;
} else  echo true; 
