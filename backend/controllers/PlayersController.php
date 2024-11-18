<?php
// PlayersController.php
require '../services/PlayersService.php';

class PlayersController {

    private $db;
    private $requestMethod;
    private $playerId;

    private $playersService;

    public function __construct($db, $requestMethod, $playerId = null)
    {
        $this->db = $db;
        $this->requestMethod = $requestMethod;
        $this->playerId = $playerId;
        $this->playersService = new PlayersService($db);
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                $response = $this->getAllPlayers();
                break;
            case 'POST':
                $response = $this->createPlayerFromRequest();
                break;
            case 'PUT':
                $response = $this->updatePlayerFromRequest($this->playerId);
                break;
            case 'DELETE':
                $response = $this->deletePlayer($this->playerId);
                break;
            default:
                $response = $this->notFoundResponse();
                break;
        }
        header($response['status_code_header']);
        if ($response['body']) {
            echo $response['body'];
        }
    }

    private function getAllPlayers() {
        $result = $this->playersService->findAllWithRankings();
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function createPlayerFromRequest() {
        $input = (array) json_decode(file_get_contents('php://input'), true);

        if (!$this->validatePlayer($input)) {
            return $this->unprocessableEntityResponse();
        }

        $this->playersService->createPlayer($input);
        $response['status_code_header'] = 'HTTP/1.1 201 Created';
        $response['body'] = json_encode(['message' => 'Player created successfully']);
        return $response;
    }

    private function updatePlayerFromRequest($id) {
        $result = $this->playersService->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }

        $input = (array) json_decode(file_get_contents('php://input'), true);
        if (!$this->validatePlayer($input)) {
            return $this->unprocessableEntityResponse();
        }

        $this->playersService->updatePlayer($id, $input);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode(['message' => 'Player updated successfully']);
        return $response;
    }

    private function deletePlayer($id) {
        $result = $this->playersService->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }

        $this->playersService->deletePlayer($id);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode(['message' => 'Player deleted successfully']);
        return $response;
    }

    private function validatePlayer($input) {
        return isset($input['number'], $input['first_name'], $input['last_name'], $input['position'], $input['height'], $input['weight'], $input['age'], $input['experience'], $input['college'], $input['description'], $input['season_rank']);
    }

    private function unprocessableEntityResponse() {
        $response['status_code_header'] = 'HTTP/1.1 422 Unprocessable Entity';
        $response['body'] = json_encode(['error' => 'Invalid input']);
        return $response;
    }

    private function notFoundResponse() {
        $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
        $response['body'] = json_encode(['error' => 'Player not found']);
        return $response;
    }
}
