<?php
// seed.php
require 'bootstrap.php';

$conn = $dbConnection;

// Process games
$gamesData = file_get_contents('init_data/games.json');

// Decode JSON data into an associative array
$games = json_decode($gamesData, true);
$sql = "INSERT INTO games (id, date, week, location, home, opponent, score, opponent_score) 
        VALUES (:id, :date, :week, :location, :home, :opponent, :score, :opponent_score)";

// Use prepare for injection protection
$stmt = $conn->prepare($sql);

foreach($games as $game) {
    $task = [
        'operation' => 'create_game',
        'data' => $game
    ];

    // Push the task to Redis
    $redisClient->rpush('taskQueue', json_encode($task));
}

// Process players
$playersData = file_get_contents('init_data/players.json');

// Decode JSON data into an associative array
$players = json_decode($playersData, true);
$sql = "INSERT INTO players (id, number, first_name, last_name, position, height, weight, age, experience, college, description, season_rank) 
        VALUES (:id, :number, :first_name, :last_name, :position, :height, :weight, :age, :experience, :college, :description, :season_rank)";
$stmt = $conn->prepare($sql);

foreach($players as $player) {
    $task = [
        'operation' => 'create_player',
        'data' => $player
    ];

    // Push the task to Redis
    $redisClient->rpush('taskQueue', json_encode($task));
}

// Process player rankings
$sql = "INSERT INTO player_rankings (player_id, game_id, `week`, `rank`) VALUES (:player_id, :game_id, :week, :rank)";

// Use prepare for injection protection
$stmt = $conn->prepare($sql);

$player_count = count($players);

// Iterate over each game entry
foreach ($players as $player) {

    foreach($games as $game) {
        $ranking = [
            'player_id' => $player['id'],
            'game_id' => $game['id'],
            'week' => $game['week'],
            'rank' => rand(1, $player_count),
        ];

        $task = [
            'operation' => 'create_ranking',
            'data' => $ranking
        ];

        // Push the task to Redis
        $redisClient->rpush('taskQueue', json_encode($task));
    }
}

// Create example user
$hashed_password = password_hash($_ENV['JWT_EXAMPLE_PASS'], PASSWORD_BCRYPT);

$query = "INSERT INTO users (username, password) VALUES (:username, :password)";
$stmt = $dbConnection->prepare($query);
$stmt->bindParam(':username', $_ENV['JWT_EXAMPLE_USER']);
$stmt->bindParam(':password', $hashed_password);
try {
    $stmt->execute();
    echo "User registered successfully.\n";
} catch (\PDOException $e) {
    exit($e->getMessage());
}