const mysql = require('mysql2/promise');

const passwords = ['', 'root', 'admin', 'password', '1234', '123456', 'mysql', 'root123'];

async function testPasswords() {
  for (let pwd of passwords) {
    try {
      const conn = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: pwd,
        database: 'roommate_db'
      });
      console.log(`✅ MATCH FOUND! MySQL Password is: "${pwd}"`);
      await conn.end();
      process.exit(0);
    } catch (err) {
      if (err.code === 'ER_BAD_DB_ERROR') {
        console.log(`✅ MySQL Connected with password "${pwd}", but database 'roommate_db' does not exist yet.`);
        process.exit(0);
      }
      // Access denied, try next
    }
  }
  console.log("❌ Could not connect with standard default passwords. User needs to set DB_PASSWORD in .env file.");
}

testPasswords();
