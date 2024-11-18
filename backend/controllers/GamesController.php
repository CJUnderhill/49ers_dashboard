<?php
// GamesController.php
require '../services/GamesService.php';

class GamesController {

    private $db;
    private $requestMethod;
    private $gameId;

    private $gamesService;

    public function __construct($db, $requestMethod, $gameId = null)
    {
        $this->db = $db;
        $this->requestMethod = $requestMethod;
        $this->gameId = $gameId;
        $this->gamesService = new GamesService($db);
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                $response = $this->getAllGames();
                break;
            case 'POST':
                $response = $this->createGameFromRequest();
                break;
            case 'PUT':
                $response = $this->updateGameFromRequest($this->gameId);
                break;
            case 'DELETE':
                $response = $this->deleteGame($this->gameId);
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

    private function getAllGames() {
        $result = $this->gamesService->findAll();
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function createGameFromRequest() {
        $input = (array) json_decode(file_get_contents('php://input'), true);

        if (!$this->validateGame($input)) {
            return $this->unprocessableEntityResponse();
        }

        $this->gamesService->createGame($input);
        $response['status_code_header'] = 'HTTP/1.1 201 Created';
        $response['body'] = json_encode(['message' => 'Game created successfully']);
        return $response;
    }

    private function updateGameFromRequest($id) {
        $result = $this->gamesService->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }

        $input = (array) json_decode(file_get_contents('php://input'), true);
        if (!$this->validateGame($input)) {
            return $this->unprocessableEntityResponse();
        }

        $this->gamesService->updateGame($id, $input);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode(['message' => 'Game updated successfully']);
        return $response;
    }

    private function deleteGame($id) {
        $result = $this->gamesService->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }

        $this->gamesService->deleteGame($id);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode(['message' => 'Game deleted successfully']);
        return $response;
    }

    private function validateGame($input) {
        return isset($input['date'], $input['week'], $input['location'], $input['home'], $input['opponent'], $input['score'], $input['opponent_score']);
    }

    private function unprocessableEntityResponse() {
        $response['status_code_header'] = 'HTTP/1.1 422 Unprocessable Entity';
        $response['body'] = json_encode(['error' => 'Invalid input']);
        return $response;
    }

    private function notFoundResponse() {
        $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
        $response['body'] = json_encode(['error' => 'Game not found']);
        return $response;
    }
}
