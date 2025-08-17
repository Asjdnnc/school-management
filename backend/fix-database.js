const { Pool } = require('pg');
require('dotenv').config({ path: './config.env' });

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

async function createTables() {
  try {
    console.log('🔧 Creating database tables...');

    // Create teachers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        qualification VARCHAR(200) NOT NULL,
        experience VARCHAR(50) NOT NULL,
        contact VARCHAR(20) NOT NULL,
        email VARCHAR(100) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Teachers table created');

    // Create students table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        roll_no VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        class VARCHAR(10) NOT NULL,
        section VARCHAR(5) NOT NULL,
        contact VARCHAR(20) NOT NULL,
        email VARCHAR(100),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Students table created');

    // Create subjects table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id SERIAL PRIMARY KEY,
        code VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        teacher_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
        class VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Subjects table created');

    // Create courses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        code VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        instructor_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
        duration VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'Upcoming',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Courses table created');

    // Create assignments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS assignments (
        id SERIAL PRIMARY KEY,
        subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        due_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'Pending',
        created_by INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Assignments table created');

    // Insert sample data
    console.log('📝 Inserting sample data...');

    // Insert teachers
    await pool.query(`
      INSERT INTO teachers (name, subject, qualification, experience, contact, email) VALUES
      ('Dr. Sharma', 'Mathematics', 'M.Sc, Ph.D', '10 Years', '9876543210', 'sharma@school.com'),
      ('Mrs. Gupta', 'Science', 'M.Sc', '7 Years', '9876501234', 'gupta@school.com'),
      ('Mr. Verma', 'English Literature', 'M.A, B.Ed', '5 Years', '9876009876', 'verma@school.com')
      ON CONFLICT DO NOTHING;
    `);

    // Insert students
    await pool.query(`
      INSERT INTO students (roll_no, name, class, section, contact, email) VALUES
      ('S101', 'Aarav Sharma', '10', 'A', '9876543210', 'aarav@student.com'),
      ('S102', 'Neha Verma', '9', 'B', '9876501234', 'neha@student.com'),
      ('S103', 'Rohan Gupta', '12', 'C', '9876009876', 'rohan@student.com')
      ON CONFLICT DO NOTHING;
    `);

    // Insert subjects
    await pool.query(`
      INSERT INTO subjects (code, name, teacher_id, class) VALUES
      ('MATH101', 'Mathematics', 1, '10'),
      ('SCI201', 'Science', 2, '9'),
      ('ENG301', 'English Literature', 3, '12')
      ON CONFLICT DO NOTHING;
    `);

    // Insert courses
    await pool.query(`
      INSERT INTO courses (code, name, instructor_id, duration, status) VALUES
      ('MATH101', 'Mathematics', 1, '6 Months', 'Ongoing'),
      ('SCI201', 'Science', 2, '6 Months', 'Upcoming'),
      ('ENG301', 'English Literature', 3, '4 Months', 'Completed')
      ON CONFLICT DO NOTHING;
    `);

    // Insert assignments
    await pool.query(`
      INSERT INTO assignments (subject_id, title, description, due_date, status, created_by) VALUES
      (1, 'Algebra Homework', 'Complete exercises 1–10 from Chapter 4.', '2025-08-20', 'Pending', 1),
      (2, 'Solar System Project', 'Make a 3D model of the solar system.', '2025-08-25', 'In Progress', 2),
      (3, 'Essay Writing', 'Write an essay on ''Importance of Reading''.', '2025-08-28', 'Completed', 3)
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Sample data inserted successfully!');
    console.log('🎉 Database is now ready to use!');

  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  } finally {
    await pool.end();
  }
}

createTables();
