<?php
/**
 * RoomMate - PHP Database Connection Config (PDO)
 * Compatible with MySQL Workbench local instance (localhost:3306)
 */

$host = 'localhost';
$port = '3306';
$dbname = 'roommate_db';
$username = 'root';
$password = ''; // Default XAMPP / MySQL Workbench local password

try {
    $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    die("Database Connection Failed: " . $e->getMessage());
}
