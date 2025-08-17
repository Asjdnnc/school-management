# School Management System - Complete Setup Guide

This guide will help you set up both the frontend and backend of the School Management System.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Step 1: Database Setup

1. **Install PostgreSQL** (if not already installed)
   - Download from: https://www.postgresql.org/download/
   - Follow installation instructions for your OS

2. **Create Database**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE school_management;
   
   # Exit psql
   \q
   ```

3. **Initialize Database Schema**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Run the schema file
   psql -U postgres -d school_management -f database/schema.sql
   ```

## Step 2: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Edit `config.env` file
   - Update database credentials:
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=school_management
     DB_USER=postgres
     DB_PASSWORD=your_password
     PORT=5000
     JWT_SECRET=your_secret_key
     ```

4. **Start the backend server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Verify backend is running**
   - Open browser and go to: http://localhost:5000
   - You should see the API welcome message

## Step 3: Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend development server**
   ```bash
   npm run dev
   ```

4. **Verify frontend is running**
   - Open browser and go to: http://localhost:5173
   - You should see the School Management System dashboard

## Step 4: Testing the Integration

1. **Check API Health**
   - Visit: http://localhost:5000/api/health
   - Should return: `{"status":"OK","message":"School Management System API is running"}`

2. **Test Dashboard**
   - Go to: http://localhost:5173
   - Dashboard should show real data from the database

3. **Test Different Pages**
   - Navigate to Students, Teachers, Courses, Subjects, and Assignments
   - All should display data from the backend

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Teachers
- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Create new teacher
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create new subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Assignments
- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Create new assignment
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/class-distribution` - Get class distribution
- `GET /api/dashboard/subject-distribution` - Get subject distribution
- `GET /api/dashboard/upcoming-assignments` - Get upcoming assignments

## Troubleshooting

### Backend Issues
1. **Database Connection Error**
   - Check if PostgreSQL is running
   - Verify database credentials in `config.env`
   - Ensure database `school_management` exists

2. **Port Already in Use**
   - Change PORT in `config.env`
   - Or kill the process using the port

### Frontend Issues
1. **API Connection Error**
   - Ensure backend is running on port 5000
   - Check CORS settings
   - Verify API_BASE_URL in `src/services/api.js`

2. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## Development Workflow

1. **Start both servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. **Make changes**
   - Backend changes will auto-restart
   - Frontend changes will hot-reload

3. **Database changes**
   - Update `database/schema.sql`
   - Re-run the schema file

## Production Deployment

1. **Backend**
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm run build
   # Serve the dist folder with a web server
   ```

## Features Implemented

- ✅ Complete CRUD operations for all entities
- ✅ Real-time data fetching from PostgreSQL
- ✅ Dashboard with statistics
- ✅ Error handling and loading states
- ✅ Responsive design
- ✅ API validation
- ✅ Database relationships and constraints

## Next Steps

- Add authentication and authorization
- Implement user roles (Admin, Teacher, Student)
- Add file upload for assignments
- Implement notifications
- Add search and filtering
- Create reports and analytics
- Add email notifications
