CREATE DATABASE IF NOT EXISTS dashboard_db;

CREATE TABLE IF NOT EXISTS games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `date` DATE NOT NULL,
    `week` INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    home BOOLEAN NOT NULL,
    opponent VARCHAR(255) NOT NULL,
    score INT NOT NULL,
    opponent_score INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    number INT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    position VARCHAR(50) NOT NULL,
    height VARCHAR(50),
    weight INT,
    age INT,
    experience INT,
    college VARCHAR(255),
    description TEXT,
    season_rank INT
);

CREATE TABLE IF NOT EXISTS player_rankings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    game_id INT NOT NULL,
    `week` INT NOT NULL,
    `rank` INT NOT NULL,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_games_date ON games(`date`);
CREATE INDEX idx_games_week ON games(`week`);

CREATE INDEX idx_players_last_name ON players(last_name);
CREATE INDEX idx_players_position ON players(position);
CREATE INDEX idx_players_college ON players(college);

CREATE INDEX idx_player_rankings_player_id ON player_rankings(player_id);
CREATE INDEX idx_player_rankings_game_id ON player_rankings(game_id);
CREATE INDEX idx_player_rankings_week ON player_rankings(`week`);

CREATE INDEX idx_users_created_at ON users(created_at);
