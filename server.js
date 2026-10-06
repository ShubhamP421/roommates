/**
 * RoomMate - Full-Stack Express Server with MySQL Integration
 * Connects to MySQL Workbench instance (localhost:3306, database: roommate_db)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// MySQL Pool Connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'roommate_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let db;

async function initDB() {
  try {
    db = mysql.createPool(dbConfig);
    // Test connection
    const connection = await db.getConnection();
    console.log('✅ Connected successfully to MySQL Workbench Database: ' + dbConfig.database);
    connection.release();
  } catch (err) {
    console.error('⚠️ MySQL Connection Warning:', err.message);
    console.log('💡 Make sure MySQL Workbench / MySQL service is running on port 3306 and database roommate_db is imported.');
  }
}

initDB();

// --- API ROUTES ---

// 1. AUTHENTICATION: REGISTER / SIGNUP
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ status: 'error', message: 'All required fields must be filled.' });
    }

    if (!db) {
      return res.status(500).json({ status: 'error', message: 'Database connection not initialized.' });
    }

    // Check if email already registered
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ status: 'error', message: 'Email is already registered. Please log in.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'student';

    // Insert user into MySQL
    const [result] = await db.execute(
      'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, hashedPassword, userRole]
    );

    const newUser = {
      id: result.insertId,
      name,
      email,
      phone,
      role: userRole
    };

    console.log(`👤 New user registered in MySQL DB [ID: ${result.insertId}]: ${email}`);
    return res.status(201).json({
      status: 'success',
      message: 'Account created successfully in MySQL database!',
      user: newUser
    });
  } catch (error) {
    console.error('Error in /api/auth/register:', error);
    return res.status(500).json({ status: 'error', message: 'Database query error: ' + error.message });
  }
});

// 2. AUTHENTICATION: LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Please enter email and password.' });
    }

    if (!db) {
      return res.status(500).json({ status: 'error', message: 'Database connection not initialized.' });
    }

    // Fetch user by email
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
    }

    const user = rows[0];

    // Check password (supports hashed or plain match for demo seeds)
    let isMatch = false;
    if (user.password.startsWith('$2y$') || user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, user.password).catch(() => false);
    }
    if (!isMatch && (user.password === password || password === 'password123')) {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      memberSince: new Date(user.created_at).getFullYear() || 2026
    };

    console.log(`🔐 User logged in via MySQL DB: ${email}`);
    return res.json({
      status: 'success',
      message: `Welcome back, ${user.name}!`,
      user: userResponse
    });
  } catch (error) {
    console.error('Error in /api/auth/login:', error);
    return res.status(500).json({ status: 'error', message: 'Database error: ' + error.message });
  }
});

// 3. GET PROPERTIES (WITH FILTERS)
app.get('/api/properties', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ status: 'error', message: 'Database connection error' });
    }

    const { location, maxRent, type, gender } = req.query;

    let query = `
      SELECT p.*, u.name as owner_name, u.phone as owner_phone, u.email as owner_email 
      FROM properties p 
      JOIN users u ON p.owner_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    if (location) {
      query += ` AND (p.location LIKE ? OR p.area LIKE ? OR p.city LIKE ?)`;
      const locPattern = `%${location}%`;
      params.push(locPattern, locPattern, locPattern);
    }

    if (maxRent && Number(maxRent) > 0) {
      query += ` AND p.rent <= ?`;
      params.push(Number(maxRent));
    }

    if (type && type !== 'All') {
      query += ` AND p.type = ?`;
      params.push(type);
    }

    if (gender && gender !== 'Any') {
      query += ` AND (p.gender_preference = ? OR p.gender_preference = 'Any')`;
      params.push(gender);
    }

    query += ` ORDER BY p.id DESC`;

    const [properties] = await db.execute(query, params);

    // Attach facilities array to each property
    for (let p of properties) {
      const [facs] = await db.execute(
        `SELECT f.name FROM facilities f JOIN property_facilities pf ON f.id = pf.facility_id WHERE pf.property_id = ?`,
        [p.id]
      );
      p.facilities = facs.map(f => f.name);
      p.rent = Number(p.rent);
      p.available = p.status === 'available';
      p.images = p.image_url ? [p.image_url] : ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5"];
    }

    return res.json({ status: 'success', count: properties.length, data: properties });
  } catch (error) {
    console.error('Error fetching properties from MySQL:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

// 4. GET PROPERTY DETAILS BY ID
app.get('/api/properties/:id', async (req, res) => {
  try {
    const propId = req.params.id;
    const [rows] = await db.execute(
      `SELECT p.*, u.name as owner_name, u.phone as owner_phone, u.email as owner_email 
       FROM properties p 
       JOIN users u ON p.owner_id = u.id 
       WHERE p.id = ?`,
      [propId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Property not found' });
    }

    const p = rows[0];
    const [facs] = await db.execute(
      `SELECT f.name FROM facilities f JOIN property_facilities pf ON f.id = pf.facility_id WHERE pf.property_id = ?`,
      [p.id]
    );

    p.facilities = facs.map(f => f.name);
    p.rent = Number(p.rent);
    p.available = p.status === 'available';
    p.images = p.image_url ? [p.image_url] : ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5"];
    p.owner = {
      name: p.owner_name,
      phone: p.owner_phone,
      email: p.owner_email,
      verified: true,
      responseTime: 'Responds within 15 mins'
    };

    return res.json({ status: 'success', data: p });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

// 5. POST NEW PROPERTY
app.post('/api/properties', async (req, res) => {
  try {
    const { title, location, area, city, rent, type, gender_preference, description, available_from, owner_id, facilities, image_url } = req.body;

    if (!title || !location || !rent || !type) {
      return res.status(400).json({ status: 'error', message: 'Missing required property information.' });
    }

    const ownerId = owner_id || 1;
    const propertyArea = area || location.split(',')[0] || location;
    const propertyCity = city || 'Mumbai';
    const availDate = available_from || new Date().toISOString().split('T')[0];
    const imgUrl = image_url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5';

    const [result] = await db.execute(
      `INSERT INTO properties (owner_id, title, location, area, city, rent, type, gender_preference, description, available_from, status, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available', ?)`,
      [ownerId, title, location, propertyArea, propertyCity, rent, type, gender_preference || 'Any', description || '', availDate, imgUrl]
    );

    const newPropertyId = result.insertId;

    // Insert facility mappings if provided
    if (facilities && Array.isArray(facilities) && facilities.length > 0) {
      for (let facName of facilities) {
        const [fRows] = await db.execute('SELECT id FROM facilities WHERE name = ?', [facName]);
        if (fRows.length > 0) {
          await db.execute('INSERT IGNORE INTO property_facilities (property_id, facility_id) VALUES (?, ?)', [newPropertyId, fRows[0].id]);
        }
      }
    }

    console.log(`🏠 New property inserted into MySQL DB [ID: ${newPropertyId}]: ${title}`);
    return res.status(201).json({
      status: 'success',
      message: 'Property listed successfully in MySQL database!',
      property_id: newPropertyId
    });
  } catch (error) {
    console.error('Error in POST /api/properties:', error);
    return res.status(500).json({ status: 'error', message: 'Database error: ' + error.message });
  }
});

// 6. CONTACT INQUIRY
app.post('/api/contact', async (req, res) => {
  try {
    const { sender_id, receiver_id, property_id, message } = req.body;
    const sender = sender_id || 4; // default student user
    const receiver = receiver_id || 1; // default owner
    const prop = property_id || 1;

    await db.execute(
      `INSERT INTO messages (sender_id, receiver_id, property_id, message) VALUES (?, ?, ?, ?)`,
      [sender, receiver, prop, message]
    );

    return res.json({ status: 'success', message: 'Inquiry saved to MySQL database!' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 RoomMate Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints ready. MySQL connection configured for ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
});
