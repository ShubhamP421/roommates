<?php
/**
 * RoomMate - REST API Endpoints Router
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../controllers/PropertyController.php';

$controller = new PropertyController($pdo);
$action = $_GET['action'] ?? 'list';

try {
    switch ($action) {
        case 'list':
            $properties = $controller->getAllProperties();
            echo json_encode(['status' => 'success', 'count' => count($properties), 'data' => $properties]);
            break;

        case 'details':
            $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
            $property = $controller->getPropertyById($id);
            if ($property) {
                echo json_encode(['status' => 'success', 'data' => $property]);
            } else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Property not found']);
            }
            break;

        case 'search':
            $location = $_GET['location'] ?? '';
            $maxRent = isset($_GET['maxRent']) ? floatval($_GET['maxRent']) : null;
            $type = $_GET['type'] ?? '';
            $gender = $_GET['gender'] ?? '';
            $results = $controller->searchProperties($location, $maxRent, $type, $gender);
            echo json_encode(['status' => 'success', 'count' => count($results), 'data' => $results]);
            break;

        case 'create':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $rawInput = file_get_contents('php://input');
                $postData = json_decode($rawInput, true) ?: $_POST;
                $newId = $controller->createProperty($postData);
                echo json_encode(['status' => 'success', 'message' => 'Property created successfully', 'property_id' => $newId]);
            } else {
                http_response_code(405);
                echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
            }
            break;

        default:
            echo json_encode(['status' => 'success', 'message' => 'RoomMate API Server Operational']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
