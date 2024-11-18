<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController {

    private $db;
    private $requestMethod;
    private $secretKey;

    public function __construct($db, $requestMethod)
    {
        $this->db = $db;
        $this->requestMethod = $requestMethod;
        $this->secretKey = $_ENV['JWT_SECRET'];
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'POST':
                $response = $this->handleAuth();
                break;
            default:
                $response['status_code_header'] = 'HTTP/1.1 405 Method Not Allowed';
                $response['body'] = null;
                break;
        }
        header($response['status_code_header']);
        if ($response['body']) {
            echo $response['body'];
        }
    }

    private function handleAuth() {
        $data = json_decode(file_get_contents("php://input"));
        $username = $data->username ?? '';
        $password = $data->password ?? '';
    
        // Retrieve user from database
        $query = "SELECT id, password FROM users WHERE username = :username LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($user && password_verify($password, $user['password'])) {
            // Password is correct, generate JWT
            $payload = [
                "iss" => "localhost",
                "aud" => "localhost",
                "iat" => time(),
                "exp" => time() + (60 * 60), // 1 hour expiration
                "data" => [
                    "id" => $user['id'],
                    "username" => $username
                ]
            ];
    
            $jwt = JWT::encode($payload, $this->secretKey, 'HS256');
            $response['status_code_header'] = 'HTTP/1.1 200 OK';
            $response['body'] = json_encode([
                "status" => "success",
                "jwt" => $jwt
            ]);
            return $response;
        } else {
            // Invalid credentials
            $response['status_code_header'] = 'HTTP/1.1 401 Unauthorized';
            $response['body'] = json_encode(["status" => "error", "message" => "Invalid credentials"]);
            return $response;
        }
    }

}