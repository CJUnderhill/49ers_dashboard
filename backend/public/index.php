<?php
require "../bootstrap.php";
require "../controllers/GamesController.php";
require "../controllers/PlayersController.php";
require "../controllers/AuthController.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// TODO HTTPS only!
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$requestMethod = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$uri = explode( '/', $uri );

if ($requestMethod === 'OPTIONS') {
    // Handle preflight requests
    http_response_code(204); // No content
    exit();
}

if($uri[1] === 'auth') {
    $controller = new AuthController($dbConnection, $requestMethod);
    $controller->processRequest();
} elseif ($uri[1] == 'games') {
    authenticate();
    $controller = new GamesController($dbConnection, $requestMethod);
    $controller->processRequest();
} elseif ($uri[1] == 'players') {
    authenticate();
    $controller = new PlayersController($dbConnection, $requestMethod);
    $controller->processRequest();
} else {
    header("HTTP/1.1 404 Not Found");
    exit();
}

function authenticate() {
    // Get authorization header
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $jwt = $matches[1];
        try {
            // Decode and verify the JWT token
            $decoded = JWT::decode($jwt, new Key($_ENV["JWT_SECRET"], 'HS256'));
        } catch (Exception $e) {
            // Token validation failed
            header("HTTP/1.1 401 Unauthorized");
            echo json_encode(["message" => "Access denied. Invalid token."]);
            exit();
        }
    } else {
        // Token not provided
        header("HTTP/1.1 401 Unauthorized");
        echo json_encode(["message" => "Access denied. Token not provided."]);
        exit();
    }
}