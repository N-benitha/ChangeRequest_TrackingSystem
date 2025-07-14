# Change Request Tracking System (CRTS)
<p align="center">
  <img src="crts.png" alt="Centered Image"/>
</p>

![Static Badge](https://img.shields.io/badge/React-61DBFB?style=for-the-badge&logo=react&logoColor=61DBFB&labelColor=black) ![Static Badge](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&labelColor=black)

<p align="center">
  A comprehensive full-stack web application for managing software change requests across development projects. Built with modern technologies and featuring role-based access control for efficient project management.
</p>

## Overview
Like any software team, we’ve all felt the frustration of chasing down change requests, lost email threads, and unclear deployment histories. I experienced it firsthand while working on various projects, where keeping track of who requested what, when it was deployed, and what issues followed could become chaotic quickly. That challenge led me to build the **Change Request Tracking System (CRTS)**, a comprehensive, full-stack web application designed to centralize and streamline the management of software change requests across development projects. In environments where accountability and traceability are crucial for quality delivery, CRTS has your back. It keeps projects organized, teams informed, and change management transparent, because when systems work smoothly, so do people.

> **Note**: This project consists of two separate repositories:
> - **Frontend**: [ChangeRequest_TrackingSystem](https://github.com/N-benitha/ChangeRequest_TrackingSystem.git)
> - **Backend**: [backend](https://github.com/N-benitha/backend.git)

## 🚀 Features

### Core Functionality
- **Project Management** - Create, update, and manage software projects
- **Change Request Tracking** - Submit, review, and track change requests with status updates
- **User Management** - Admin controls for user creation and role assignment
- **Role-Based Access Control** - Three distinct user roles with specific permissions
- **Real-time Reports** - Analytics and reporting dashboard with filtering options
- **Project Assignment** - Assign users to specific projects with proper authorization

### User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, user management, project management, reports |
| **Approver** | Review and approve/reject change requests, view reports |
| **Developer** | Create change requests, view assigned projects, track request history |

## 🛠️ Tech Stack

### Frontend Repository: [ChangeRequest_TrackingSystem](https://github.com/N-benitha/ChangeRequest_TrackingSystem.git)
- **React.js** with TypeScript
- **React Router** for navigation
- **Axios** for API communication
- **FontAwesome** icons
- **Modern CSS** with responsive design
- **Vite** for development and building

### Backend Repository: [backend](https://github.com/N-benitha/backend.git)
- **NestJS** with TypeScript
- **PostgreSQL** database
- **JWT Authentication** with HTTP-only cookies
- **bcrypt** for password hashing
- **Role-based guards** for authorization

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Git**

## 🚀 Installation & Setup

### 1. Clone Both Repositories

```bash
# Clone the frontend repository
git clone https://github.com/yourusername/ChangeRequest_TrackingSystem.git

# Clone the backend repository
git clone https://github.com/yourusername/backend.git
```

### 2. Backend Setup

```bash
# Navigate to backend repository
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Run database migrations (if applicable)
npm run migration:run

# Start the backend server
npm run start:dev
```

### Backend Environment Variables (.env file):

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=change_request_db

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h

# Application
PORT=3000
NODE_ENV=development

# CORS (for frontend)
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
# Navigate to frontend repository (in a new terminal)
cd ChangeRequest_TrackingSystem

# Install dependencies
npm install

# Create environment file (if needed)
echo "VITE_API_URL=http://localhost:3000" > .env

# Start the development server
npm run dev
```

### 4. Verify Setup

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Health Check: http://localhost:3000/auth/me

🎯 Usage
Getting Started

### 1. Start Both Servers
```bash
# Terminal 1 - Backend
cd backend && npm run start:dev

# Terminal 2 - Frontend
cd ChangeRequest_TrackingSystem && npm run dev
```

### 2. Default Admin Account
```
Email: admin@example.com
Password: admin123
```
### 3. Create Your First Project

- Log in as admin
- Navigate to Projects → Add Project
- Fill in project details


### 4. Add Team Members

- Go to Users → Add User
- Assign appropriate roles
- Assign users to projects

### Workflow Example

1. Admin creates projects and assigns developers
2. The developer submits change requests for assigned projects
3. Approver reviews and approves/rejects requests
4. All users can view reports and track progress

## 🔒 Authentication & Security

- JWT Tokens stored in HTTP-only cookies
- Password Hashing using bcrypt with salt rounds
- Role-Based Authorization with custom NestJS guards
- Input Validation on all endpoints using DTOs
- CORS Protection configured for frontend domain
- Environment Variables for all sensitive data

## 📊 API Endpoints
### Authentication
```
POST /auth/login          # User login
POST /auth/logout         # User logout
POST /auth/signup         # User registration
GET  /auth/me            # Get current user
POST /auth/refresh       # Refresh JWT token
```
### Users (Admin only)
```
GET    /users            # Get all users
POST   /users/create     # Create new user
GET    /users/:id        # Get user by ID
PATCH  /users/:id        # Update user
DELETE /users/:id        # Delete user
```
### Projects
```
GET    /project/all-projects     # Get all projects
POST   /project/create           # Create project
GET    /project/:id              # Get project by ID
PATCH  /project/:id              # Update project
DELETE /project/:id              # Delete project
```
### Change Requests
```
GET    /change-request/all-users         # Get all change requests
POST   /change-request/create            # Create change request
GET    /change-request/query             # Query change requests with filters
PATCH  /change-request/:id               # Update change request status
DELETE /change-request/:id               # Delete change request
```
### User-Project Assignment
```
GET    /user-project/by-user/:userId     # Get projects assigned to user
POST   /user-project                     # Assign user to project
DELETE /user-project                     # Remove user from project
```

## 🚀 Deployment
### Production Build
#### Frontend (ChangeRequest_TrackingSystem):
```bash
cd ChangeRequest_TrackingSystem
npm run build
# Deploy dist/ folder to your hosting service
```
#### Backend:
```bash
cd backend
npm run build
npm run start:prod
```
### Environment Setup for Production

- Set NODE_ENV=production in backend
- Update VITE_API_URL in frontend to production API URL
- Use production database credentials
- Configure proper CORS origins
- Set secure JWT secrets (minimum 32 characters)

### Deployment Options

- Frontend: Vercel, Netlify, GitHub Pages
- Backend: Heroku, DigitalOcean, AWS, Railway
- Database: PostgreSQL on cloud providers

## 🤝 Contributing
### For Frontend Repository (ChangeRequest_TrackingSystem)

1. Fork the [ChangeRequest_TrackingSystem](https://github.com/N-benitha/ChangeRequest_TrackingSystem.git) repository
2. Create a feature branch: git checkout -b feature/frontend-feature
3. Make your changes and commit: git commit -m 'Add frontend feature'
4. Push to branch: git push origin feature/frontend-feature
5. Open a Pull Request

### For Backend Repository

1. Fork the [backend](https://github.com/N-benitha/backend.git) repository
2. Create a feature branch: git checkout -b feature/backend-feature
3. Make your changes and commit: git commit -m 'Add backend feature'
4. Push to branch: git push origin feature/backend-feature
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices in both repositories
- Maintain consistent code formatting (Prettier/ESLint)
- Write meaningful commit messages
- Test your changes locally with both the frontend and backend running
- Update documentation as needed

## 🐛 Common Issues & Solutions
### CORS Issues
**Problem:** Frontend can't connect to backend
**Solution:**
```typescript
// In backend main.ts
app.enableCors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true
});
```
### Database Connection Issues
```bash
# Check PostgreSQL service
sudo service postgresql status

# Verify database exists
psql -U username -d change_request_db
```
### Port Already in Use
```bash
# Kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```
### Authentication Issues

- Clear browser cookies and localStorage
- Check JWT secret consistency in backend .env
- Verify API_URL in frontend environment

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```
## 📝 API Configuration
### Frontend API Setup
The frontend uses Axios with base configuration:
```typescript
// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

export default api;
```
## 🔗 Repository Links

Frontend: [ChangeRequest_TrackingSystem](https://github.com/N-benitha/ChangeRequest_TrackingSystem.git)
Backend: [backend](https://github.com/N-benitha/backend.git)

## 🙏 Acknowledgments

- **ALX Africa** - This project was developed as part of the ALX Software Engineering Program. Special thanks to ALX for providing world-class software engineering education and the opportunity to build real-world applications that solve practical problems.
- **ALX Technical Mentors** - For guidance on best practices, code architecture, and professional development standards

## 👨‍💻 Author
**Benitha Ngunga** ngungabn03@gmail.com

## 📝 License
This project is licensed under the [MIT License](LICENSE).

## Contact
For support or inquiries, do not hesitate to contact me here. [LinkedIn](https://www.linkedin.com/in/ngunga-benitha-26b43921b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)

⭐ If you found this project helpful, please give both repositories a star!

*This project represents the culmination of skills learned through the ALX Software Engineering Program, demonstrating proficiency in full-stack development, database design, authentication systems, and modern web technologies.*
