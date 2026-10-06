-- =========================================================
-- RoomMate - Student Accommodation Database Schema
-- Compatible with MySQL Workbench 8.0+, XAMPP, and WampServer
-- =========================================================

CREATE DATABASE IF NOT EXISTS roommate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE roommate_db;

-- ---------------------------------------------------------
-- 1. Table: users
-- ---------------------------------------------------------
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS favourites;
DROP TABLE IF EXISTS property_facilities;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS facilities;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'owner', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- 2. Table: properties
-- ---------------------------------------------------------
CREATE TABLE properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    location VARCHAR(150) NOT NULL,
    area VARCHAR(80) NOT NULL,
    city VARCHAR(80) NOT NULL,
    rent DECIMAL(10, 2) NOT NULL,
    type ENUM('PG', 'Hostel', 'Private Room', 'Shared Room', '1BHK') NOT NULL,
    gender_preference ENUM('Male', 'Female', 'Any') DEFAULT 'Any',
    description TEXT NOT NULL,
    available_from DATE NOT NULL,
    status ENUM('available', 'occupied') DEFAULT 'available',
    rating DECIMAL(2, 1) DEFAULT 4.5,
    image_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- 3. Table: facilities
-- ---------------------------------------------------------
CREATE TABLE facilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    icon_class VARCHAR(50) DEFAULT 'ri-check-line'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- 4. Table: property_facilities (Junction Table)
-- ---------------------------------------------------------
CREATE TABLE property_facilities (
    property_id INT NOT NULL,
    facility_id INT NOT NULL,
    PRIMARY KEY (property_id, facility_id),
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- 5. Table: favourites
-- ---------------------------------------------------------
CREATE TABLE favourites (
    user_id INT NOT NULL,
    property_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, property_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- 6. Table: messages (Contact Owner Inquiries)
-- ---------------------------------------------------------
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    property_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- SEED SAMPLE DATA FOR DEMONSTRATION
-- =========================================================

-- Seed Users
INSERT INTO users (id, name, email, phone, password, role) VALUES
(1, 'Rajesh Sharma', 'rajesh.vashi@roommate.in', '+91 98201 45678', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1z7nC89x.4A.zC9o7Gk2.x111111111', 'owner'),
(2, 'Amit Patil', 'amit.patil@roommate.in', '+91 97690 12345', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1z7nC89x.4A.zC9o7Gk2.x111111111', 'owner'),
(3, 'Sunita Kulkarni', 'sunita.powai@roommate.in', '+91 98199 87654', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1z7nC89x.4A.zC9o7Gk2.x111111111', 'owner'),
(4, 'Aarav Sharma', 'aarav.student@college.edu', '+91 98765 43210', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1z7nC89x.4A.zC9o7Gk2.x111111111', 'student');

-- Seed Facilities
INSERT INTO facilities (id, name, icon_class) VALUES
(1, 'Wi-Fi', 'ri-wifi-line'),
(2, 'AC', 'ri-temp-cold-line'),
(3, 'Food', 'ri-restaurant-line'),
(4, 'Laundry', 'ri-t-shirt-air-line'),
(5, 'Parking', 'ri-parking-box-line'),
(6, 'CCTV', 'ri-shield-check-line'),
(7, 'Power Backup', 'ri-flashlight-line');

-- Seed Sample Properties
INSERT INTO properties (id, owner_id, title, location, area, city, rent, type, gender_preference, description, available_from, status, rating, image_url) VALUES
(1, 1, 'Campus Nest PG', 'Vashi, Navi Mumbai', 'Vashi', 'Navi Mumbai', 8500.00, 'PG', 'Any', 'Comfortable, fully furnished student accommodation near Vashi station.', '2026-10-10', 'available', 4.8, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5'),
(2, 2, 'Student Square', 'Thane West, Thane', 'Thane West', 'Thane', 7500.00, 'Shared Room', 'Male', 'Spacious twin-sharing rooms tailored for male college students.', '2026-10-15', 'available', 4.6, 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf'),
(3, 3, 'Green View Residence', 'Powai, Mumbai', 'Powai', 'Mumbai', 11000.00, 'Private Room', 'Any', 'Premium private room accommodation right next to IIT Bombay.', '2026-10-01', 'available', 4.9, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'),
(4, 3, 'Urban Stay', 'Andheri East, Mumbai', 'Andheri East', 'Mumbai', 9500.00, 'PG', 'Female', 'Safe and hygienic girls PG near Andheri metro station with 24/7 security.', '2026-10-05', 'available', 4.7, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750');

-- Link Property Facilities
INSERT INTO property_facilities (property_id, facility_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 6), (1, 7),
(2, 1), (2, 3), (2, 4), (2, 5), (2, 6),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 6), (4, 7);

-- Seed Favourites
INSERT INTO favourites (user_id, property_id) VALUES
(4, 1),
(4, 3);

-- Seed Inquiries / Messages
INSERT INTO messages (sender_id, receiver_id, property_id, message) VALUES
(4, 1, 1, 'Hi Rajesh, is Campus Nest PG available for a visit this Saturday afternoon?');
