<?php

class GamesService {

    private $db = null;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function findAll()
    {
        $query = "
            SELECT 
                *
            FROM
                games;
        ";

        try {
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function createGame($data) {
        $sql = "INSERT INTO games (date, week, location, home, opponent, score, opponent_score) VALUES (:date, :week, :location, :home, :opponent, :score, :opponent_score)";
        $stmt = $this->db->prepare($sql);
        // Bind parameters to the SQL statement with validation
        $stmt->bindParam(':date', $data['date'], PDO::PARAM_STR);
        $stmt->bindParam(':week', $data['week'], PDO::PARAM_INT);
        $stmt->bindParam(':location', $data['location'], PDO::PARAM_STR);
        $stmt->bindParam(':home', $data['home'], PDO::PARAM_BOOL);
        $stmt->bindParam(':opponent', $data['opponent'], PDO::PARAM_STR);
        $stmt->bindParam(':score', $data['score'], PDO::PARAM_INT);
        $stmt->bindParam(':opponent_score', $data['opponent_score'], PDO::PARAM_INT);

        // Execute the statement for each game entry
        try {
            $stmt->execute();
            echo "Data successfully inserted into the Games table.\n";
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function updateGame($id, $data) {
        $sql = "UPDATE games SET date = :date, week = :week, location = :location, home = :home, opponent = :opponent, score = :score, opponent_score = :opponent_score WHERE id = :id";
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':date', $data['date'], PDO::PARAM_STR);
        $stmt->bindParam(':week', $data['week'], PDO::PARAM_INT);
        $stmt->bindParam(':location', $data['location'], PDO::PARAM_STR);
        $stmt->bindParam(':home', $data['home'], PDO::PARAM_BOOL);
        $stmt->bindParam(':opponent', $data['opponent'], PDO::PARAM_STR);
        $stmt->bindParam(':score', $data['score'], PDO::PARAM_INT);
        $stmt->bindParam(':opponent_score', $data['opponent_score'], PDO::PARAM_INT);

        try {
            $stmt->execute();
            echo "Game with ID $id successfully updated.\n";
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function deleteGame($id) {
        $sql = "DELETE FROM games WHERE id = :id";
        
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        try {
            $stmt->execute();
            echo "Game with ID $id successfully deleted.\n";
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }
}