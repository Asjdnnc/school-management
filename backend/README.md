# School Management System - Backend

A comprehensive REST API backend for the School Management System built with Node.js, Express, and PostgreSQL.

## Features

- **Student Management**: CRUD operations for student records
- **Teacher Management**: CRUD operations for teacher records
- **Subject Management**: CRUD operations for subject records with teacher assignments
- **Course Management**: CRUD operations for course records with instructor assignments
- **Assignment Management**: CRUD operations for assignment records
- **Dashboard Analytics**: Statistics and summary data for the dashboard
- **Data Validation**: Input validation using express-validator
- **Error Handling**: Comprehensive error handling and logging

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   - Create a new database named `school_management`
   - Update the database configuration in `config.env`

4. **Configure environment variables**
   ```bash
   # Copy and edit the config file
   cp config.env.example config.env
   ```
   
   Update the following variables in `config.env`:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=school_management
   DB_USER=your_username
   DB_PASSWORD=your_password
   PORT=5000
   JWT_SECRET=your_secret_key
   ```

5. **Initialize the database**
   ```bash
   # Connect to your PostgreSQL database and run the schema
   psql -U your_username -d school_management -f database/schema.sql
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Teachers
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get teacher by ID
- `POST /api/teachers` - Create new teacher
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

### Subjects
- `GET /api/subjects` - Get all subjects with teacher information
- `GET /api/subjects/:id` - Get subject by ID
- `POST /api/subjects` - Create new subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Courses
- `GET /api/courses` - Get all courses with instructor information
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Assignments
- `GET /api/assignments` - Get all assignments with subject and teacher information
- `GET /api/assignments/:id` - Get assignment by ID
- `POST /api/assignments` - Create new assignment
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/class-distribution` - Get class-wise student distribution
- `GET /api/dashboard/subject-distribution` - Get subject-wise teacher distribution
- `GET /api/dashboard/upcoming-assignments` - Get upcoming assignments

### Health Check
- `GET /api/health` - Health check endpoint

## Database Schema

The system uses the following main tables:
- `students` - Student information
- `teachers` - Teacher information
- `subjects` - Subject information with teacher assignments
- `courses` - Course information with instructor assignments
- `assignments` - Assignment information
- `student_assignments` - Student assignment progress tracking

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

### Database Migrations
To add new database migrations, create SQL files in the `database/migrations/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
