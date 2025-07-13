# Change Request Tracking System
  ![alt banner](crts.png)

Like any software team, we’ve all felt the frustration of chasing down change requests, lost email threads, and unclear deployment histories. I experienced it firsthand while working on various projects, where keeping track of who requested what, when it was deployed, and what issues followed could become chaotic quickly. That challenge led me to build the Change Request Tracking System (CRTS), a comprehensive, full-stack web application designed to centralize and streamline the management of software change requests across development projects. In environments where accountability and traceability are crucial for quality delivery, CRTS has your back. It keeps projects organized, teams informed, and change management transparent, because when systems work smoothly, so do people.

## Overview
A comprehensive full-stack web application for managing software change requests across development projects. Built with modern technologies and featuring role-based access control for efficient project management.

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
