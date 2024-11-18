<?php
// QueueWorker.php - Worker script to continually process the worker queue in the background

require __DIR__.'/../bootstrap.php'; // Include your DB connection file
require __DIR__.'/../services/GamesService.php';
require __DIR__.'/../services/PlayersService.php';

// Create a Redis client
$redis = $redisClient;

$queueName = 'taskQueue';

while (true) {
    // Block and pop the task from the queue
    $taskJson = $redis->blpop($queueName, 0); // 0 = block forever until a task is available

    if ($taskJson) {
        $task = json_decode($taskJson[1], true);
        processTask($task, $dbConnection);
    }
}

function processTask($task, $dbConnection) {
    $splitOperation = explode("_", $task['operation']); // split into "CRUD operation" and "API"

    switch ($splitOperation[1]) {
        case 'game':
            handleGameOperation($splitOperation[0], $task['data'], $dbConnection);
            break;
        case 'player': 
            handlePlayerOperation($splitOperation[0], $task['data'], $dbConnection);
            break;
        case 'ranking': 
            handleRankingOperation($splitOperation[0], $task['data'], $dbConnection);
            break;
        default:
            echo "Unknown operation: " . $task['operation'] . ". Ignoring.\n";
            break;
    }
}

function handleGameOperation($operation, $data, $dbConnection) {
    $service = new GamesService($dbConnection);
    switch ($operation) {
        case 'create':
            $service->createGame($data);
            break;
        case 'update': 
            $service->updateGame($data);
            break;
        case 'delete': 
            $service->updateGame($data);
            break;
        default:
            echo "Unknown operation: " . $operation . ". Ignoring.\n";
            break;
    }
}

function handlePlayerOperation($operation, $data, $dbConnection) {
    $service = new PlayersService($dbConnection);
    switch ($operation) {
        case 'create':
            $service->createPlayer($data);
            break;
        case 'update': 
            $service->updatePlayer($data);
            break;
        case 'delete': 
            $service->updatePlayer($data);
            break;
        default:
            echo "Unknown operation: " . $operation . ". Ignoring.\n";
            break;
    }
}

function handleRankingOperation($operation, $data, $dbConnection) {
    $service = new PlayersService($dbConnection);
    switch ($operation) {
        case 'create':
            $service->createPlayerRanking($data);
            break;
        case 'update': 
            $service->updatePlayerRanking($data);
            break;
        case 'delete': 
            $service->updatePlayerRanking($data);
            break;
        default:
            echo "Unknown operation: " . $operation . ". Ignoring.\n";
            break;
    }
}
