<?php
require 'vendor/autoload.php';
use Dotenv\Dotenv;
require 'utils/DatabaseConnector.php';

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$dbConnection = (new DatabaseConnector())->getConnection();

$redisClient = new Predis\Client([
    'scheme' => 'tcp',
    'host'   => 'redis',
    'port'   => 6379,
    'read_write_timeout' => -1, // Disable read/write timeout for long operations
]);