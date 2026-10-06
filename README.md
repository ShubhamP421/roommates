# RoomMate — Student Accommodation & Roommate Finder

> **College Mini-Project** | Web Application Development  
> **Tagline:** *"Find a place. Find your people."*

---

## 📌 Project Overview
**RoomMate** is a modern, responsive web application designed for college students searching for affordable rooms, PGs, student hostels, private rooms, and shared accommodations near college campuses in Mumbai, Thane, Navi Mumbai, Powai, Andheri, and Vashi.

The project features a clean separation between a interactive frontend and a MySQL database backend structure.

---

## ✨ Features Checklist
- [x] **Home Page:** Hero section with quick multi-field search box, popular location chips, 6 popular student stays cards, and platform value highlights.
- [x] **Find a Room (Properties Page):** Left-side interactive filter sidebar (Location, Min/Max Rent range, Accommodation Type, Gender Preference, Facilities, Availability) + Results toolbar with total count & sorting (Price Low to High, High to Low, Rating).
- [x] **Property Details Page:** Dynamic property page rendering based on URL ID (`?id=X`), showcasing high-res photo gallery, property specs, facility badges, house rules, nearby colleges/landmarks with distance, and verified owner card.
- [x] **Contact Owner Modal:** Simulates instant phone contact & direct message inquiry to property owners with feedback toast notifications.
- [x] **Favourites Page:** Allows students to save properties, persisted across browser sessions using `localStorage` with instant removal and custom empty state.
- [x] **Post Property Form:** Owner property listing form with facility checkboxes, live card preview, and validation.
- [x] **Mock Auth & Student Dashboard:** Login and Sign Up UI with user session management, saved stays counter, and dashboard tabs.
- [x] **Toast Notifications:** Custom toast notification system replacing generic browser `alert()` popups.
- [x] **Responsive UI:** Fully responsive design supporting desktop, tablet, and mobile hamburger navigation.

---

## 🗄️ MySQL Workbench Connection Guide (College Viva Ready)

Connecting RoomMate to MySQL Workbench is straightforward. Follow these steps:

### Step 1: Launch MySQL Workbench
1. Open **MySQL Workbench** on your system.
2. Click on your local connection (typically `Local instance MySQL57` or `Local instance MySQL80` at `127.0.0.1:3306`).
3. Enter your password if prompted (default for XAMPP is empty password `""`, default for WAMP/Workbench is often `root` or your custom password).

### Step 2: Open and Execute `schema.sql`
1. In MySQL Workbench, click **File -> Open SQL Script...** (or press `Ctrl + O`).
2. Browse to the project backend database folder:
   ```
   RoomMate/backend/database/schema.sql
   ```
3. Click **Open**. The SQL script containing all table definitions and initial seed data will load into the Query editor.
4. Click the **Execute (Lightning Bolt icon ⚡)** at the top toolbar (or press `Ctrl + Shift + Enter`).
5. Verify in the Output window at the bottom that all queries executed successfully with green checkmarks.

### Step 3: Verify the Database Schema
1. In the **SCHEMAS** pane on the left side of MySQL Workbench, right-click and select **Refresh All**.
2. You will see the new database `roommate_db` with the following 6 relational tables:
   - `users`: User profiles (students & property owners).
   - `properties`: Property listings, rent, location, type, and availability.
   - `facilities`: Amenity master list (Wi-Fi, AC, Food, Laundry, etc.).
   - `property_facilities`: Junction table linking properties to amenities.
   - `favourites`: Saved properties per student.
   - `messages`: Inquiry messages sent from students to property owners.

---

## 📂 Project Directory Structure

```
RoomMate/
│
├── index.html              # Home page (Hero, Search box, Popular stays)
├── properties.html         # Property Search & Filter page
├── property-details.html   # Detailed property view with gallery & contact modal
├── favourites.html         # Saved favourite stays page (localStorage)
├── post-property.html      # Add property listing form with live preview
├── login.html              # Student/Owner login page
├── signup.html             # Student registration page
├── dashboard.html          # Student profile & saved stays dashboard
│
├── css/
│   └── style.css           # Complete responsive CSS design system
│
├── js/
│   ├── data.js             # Realistic sample Indian property dataset (12 stays)
│   ├── app.js              # Toast engine, navbar toggle, localStorage & card builder
│   ├── filters.js          # Search, filter, and sorting logic for properties page
│   └── auth.js             # Mock authentication session & dashboard loader
│
└── backend/
    ├── config/
    │   ├── db.php          # PHP PDO database connection
    │   └── db.js           # Node.js mysql2 database connection
    ├── controllers/
    │   └── PropertyController.php  # Property controller logic
    ├── routes/
    │   └── api.php         # RESTful API endpoint router
    └── database/
        └── schema.sql      # MySQL Workbench DDL script & seed data
```

---

## 🚀 How to Run the Application Locally

1. **Option A: Static Web Server (Simplest & Quickest)**
   - Open VS Code or any editor.
   - Right-click `index.html` and select **Open with Live Server** (or open `index.html` directly in any web browser).
   - The entire website is immediately functional using the built-in JavaScript sample dataset and browser `localStorage`.

2. **Option B: PHP / Apache (XAMPP / WAMP)**
   - Copy the `RoomMate` folder into your `htdocs` directory (e.g. `C:\xampp\htdocs\RoomMate`).
   - Import `backend/database/schema.sql` into phpMyAdmin or MySQL Workbench.
   - Access the application in browser at `http://localhost/RoomMate/`.

---

## 🎨 Color Palette & Design System
- **Primary Color:** Deep Navy Blue (`#1E3A8A` / `#0F172A`)
- **Accent Color:** Soft Emerald Green (`#10B981` / `#059669`)
- **Background:** Minimal Off-white (`#F8FAFC`)
- **Typography:** *Plus Jakarta Sans* (Google Fonts)
- **Icons:** Remix Icon (`CDN v3.5.0`)
