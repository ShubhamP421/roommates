<?php
/**
 * RoomMate - Property Controller
 * Handles business logic for fetching, filtering, and saving student properties.
 */

require_once __DIR__ . '/../config/db.php';

class PropertyController {
    private $db;

    public function __construct($pdo) {
        $this->db = $pdo;
    }

    // Get all properties with owner info
    public function getAllProperties() {
        $sql = "SELECT p.*, u.name as owner_name, u.phone as owner_phone, u.email as owner_email 
                FROM properties p 
                JOIN users u ON p.owner_id = u.id 
                ORDER BY p.id DESC";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll();
    }

    // Get single property details by ID
    public function getPropertyById($id) {
        $sql = "SELECT p.*, u.name as owner_name, u.phone as owner_phone, u.email as owner_email 
                FROM properties p 
                JOIN users u ON p.owner_id = u.id 
                WHERE p.id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['id' => $id]);
        $property = $stmt->fetch();

        if ($property) {
            // Fetch associated facilities
            $facSql = "SELECT f.name FROM facilities f 
                       JOIN property_facilities pf ON f.id = pf.facility_id 
                       WHERE pf.property_id = :pid";
            $facStmt = $this->db->prepare($facSql);
            $facStmt->execute(['pid' => $id]);
            $property['facilities'] = array_column($facStmt->fetchAll(), 'name');
        }

        return $property;
    }

    // Filter properties based on search params
    public function searchProperties($location = '', $maxRent = null, $type = '', $gender = '') {
        $sql = "SELECT p.*, u.name as owner_name FROM properties p JOIN users u ON p.owner_id = u.id WHERE 1=1";
        $params = [];

        if (!empty($location)) {
            $sql .= " AND (p.location LIKE :loc OR p.area LIKE :loc OR p.city LIKE :loc)";
            $params['loc'] = '%' . $location . '%';
        }

        if ($maxRent !== null && $maxRent > 0) {
            $sql .= " AND p.rent <= :maxRent";
            $params['maxRent'] = $maxRent;
        }

        if (!empty($type) && $type !== 'All') {
            $sql .= " AND p.type = :type";
            $params['type'] = $type;
        }

        if (!empty($gender) && $gender !== 'Any') {
            $sql .= " AND (p.gender_preference = :gender OR p.gender_preference = 'Any')";
            $params['gender'] = $gender;
        }

        $sql .= " ORDER BY p.rent ASC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    // Insert new property from Post Property form
    public function createProperty($data) {
        $sql = "INSERT INTO properties (owner_id, title, location, area, city, rent, type, gender_preference, description, available_from, status) 
                VALUES (:owner_id, :title, :location, :area, :city, :rent, :type, :gender, :description, :available_from, 'available')";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            'owner_id' => $data['owner_id'] ?? 1,
            'title' => $data['title'],
            'location' => $data['location'],
            'area' => $data['area'] ?? $data['location'],
            'city' => $data['city'] ?? 'Mumbai',
            'rent' => $data['rent'],
            'type' => $data['type'],
            'gender' => $data['gender_preference'] ?? 'Any',
            'description' => $data['description'],
            'available_from' => $data['available_from'] ?? date('Y-m-d')
        ]);
        return $this->db->lastInsertId();
    }
}
