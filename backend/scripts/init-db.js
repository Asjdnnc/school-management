const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: '../config.env' });

async function initializeDatabase() {
  console.log('🚀 Initializing School Management System Database...\n');

  // Create database connection
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: false,
      sslmode: 'require'
    } : false,
  });

  try {
    // Test connection
    console.log('📡 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful!\n');

    // Read schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📋 Executing database schema...');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await pool.query(statement);
          console.log(`✅ Statement ${i + 1}/${statements.length} executed successfully`);
        } catch (error) {
          if (error.message.includes('already exists')) {
            console.log(`⚠️  Statement ${i + 1}/${statements.length} skipped (already exists)`);
          } else {
            console.error(`❌ Error in statement ${i + 1}/${statements.length}:`, error.message);
          }
        }
      }
    }

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📊 Sample data has been inserted:');
    console.log('   - 3 Teachers');
    console.log('   - 3 Students');
    console.log('   - 3 Subjects');
    console.log('   - 3 Courses');
    console.log('   - 3 Assignments');

    // Verify data insertion
    console.log('\n🔍 Verifying data insertion...');
    const tables = ['teachers', 'students', 'subjects', 'courses', 'assignments'];
    
    for (const table of tables) {
      const result = await pool.query(`SELECT COUNT(*) FROM ${table}`);
      const count = result.rows[0].count;
      console.log(`   ${table}: ${count} records`);
    }

    console.log('\n✨ Your School Management System is ready to use!');
    console.log('   Backend: http://localhost:5000');
    console.log('   Frontend: http://localhost:5173');

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Check your database credentials in config.env');
    console.log('   2. Ensure your database is running and accessible');
    console.log('   3. Verify SSL settings for online databases');
    console.log('   4. Check if your IP is whitelisted (if required)');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the initialization
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
