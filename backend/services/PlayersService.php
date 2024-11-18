<?php

class PlayersService {

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
                players;
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


    public function findAllWithRankings()
    {
        $query = "
            SELECT 
                p.id,
                p.number,
                p.first_name,
                p.last_name,
                p.position,
                p.height,
                p.weight,
                p.age,
                p.experience,
                p.college,
                p.description,
                p.season_rank,
                JSON_OBJECTAGG(pr.week, pr.rank) AS rankings_dict
            FROM 
                players p
            LEFT JOIN 
                player_rankings pr ON p.id = pr.player_id
            GROUP BY 
                p.id;
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

    public function findPlayerRankings($playerId)
    {
        $query = "
            SELECT 
                *
            FROM
                player_rankings
            WHERE
                player_id = $playerId
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

    public function createPlayer($data) {
        $sql = "INSERT INTO players (number, first_name, last_name, position, height, weight, age, experience, college, description, season_rank) VALUES (:number, :first_name, :last_name, :position, :height, :weight, :age, :experience, :college, :description, :season_rank)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':number' => $data['number'],
            ':first_name' => $data['first_name'],
            ':last_name' => $data['last_name'],
            ':position' => $data['position'],
            ':height' => $data['height'],
            ':weight' => $data['weight'],
            ':age' => $data['age'],
            ':experience' => $data['experience'],
            ':college' => $data['college'],
            ':description' => $data['description'],
            ':season_rank' => $data['season_rank'],
        ]);
        echo "Player created: " . $data['first_name'] . " " . $data['last_name'] . "\n";
    }

    public function updatePlayer($id, $data) {
        $sql = "UPDATE players SET number = :number, first_name = :first_name, last_name = :last_name, position = :position, height = :height, weight = :weight, age = :age, experience = :experience, college = :college, description = :description, season_rank = :season_rank WHERE id = :id";
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':number', $data['number'], PDO::PARAM_INT);
        $stmt->bindParam(':first_name', $data['first_name'], PDO::PARAM_STR);
        $stmt->bindParam(':last_name', $data['last_name'], PDO::PARAM_STR);
        $stmt->bindParam(':position', $data['position'], PDO::PARAM_STR);
        $stmt->bindParam(':height', $data['height'], PDO::PARAM_STR);
        $stmt->bindParam(':weight', $data['weight'], PDO::PARAM_INT);
        $stmt->bindParam(':age', $data['age'], PDO::PARAM_INT);
        $stmt->bindParam(':experience', $data['experience'], PDO::PARAM_INT);
        $stmt->bindParam(':college', $data['college'], PDO::PARAM_STR);
        $stmt->bindParam(':description', $data['description'], PDO::PARAM_STR);
        $stmt->bindParam(':season_rank', $data['season_rank'], PDO::PARAM_INT);

        try {
            $stmt->execute();
            echo "Player with ID $id successfully updated.\n";
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function deletePlayer($id) {
        $sql = "DELETE FROM players WHERE id = :id";
        
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        try {
            $stmt->execute();
            echo "Player with ID $id successfully deleted.\n";
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function createPlayerRanking($data) {
        $sql = "INSERT INTO player_rankings (player_id, game_id, `week`, `rank`) VALUES (:player_id, :game_id, :week, :rank)";
        $stmt = $this->db->prepare($sql);

        $stmt->bindParam(':player_id', $data['player_id'], PDO::PARAM_INT);
        $stmt->bindParam(':game_id', $data['game_id'], PDO::PARAM_INT);
        $stmt->bindParam(':week', $data['week'], PDO::PARAM_INT);
        $stmt->bindParam(':rank', $data['rank'], PDO::PARAM_INT);

        try {
            $stmt->execute();
            echo "Data successfully inserted into the PlayerRankings table.\n";
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function updatePlayerRanking($id, $data) {
        $sql = "UPDATE player_rankings SET player_id = :player_id, game_id = :game_id, week = :week, rank = :rank WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':player_id', $data['player_id'], PDO::PARAM_INT);
        $stmt->bindParam(':game_id', $data['game_id'], PDO::PARAM_INT);
        $stmt->bindParam(':week', $data['week'], PDO::PARAM_INT);
        $stmt->bindParam(':rank', $data['rank'], PDO::PARAM_INT);

        try {
            $stmt->execute();
            echo "Player ranking with ID $id successfully updated.\n";
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function deletePlayerRanking($id) {
        $sql = "DELETE FROM player_rankings WHERE id = :id";

        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        try {
            $stmt->execute();
            echo "Player ranking with ID $id successfully deleted.\n";
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

}