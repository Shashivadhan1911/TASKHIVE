# TaskHive - Task Management Application

A modern, full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js). TaskHive provides an intuitive interface for managing tasks, boards, and team collaboration with real-time features.

## 🚀 Features

- **User Authentication**: Secure user registration and login system
- **Task Management**: Create, edit, delete, and organize tasks
- **Board System**: Kanban-style boards for project organization
- **Drag & Drop**: Intuitive drag-and-drop functionality for task management
- **Comments**: Add comments to tasks for better collaboration
- **Real-time Updates**: Live updates across the application
- **Responsive Design**: Mobile-friendly interface
- **Security**: Rate limiting, CORS protection, input validation

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **express-rate-limit** - Rate limiting

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **@hello-pangea/dnd** - Drag and drop functionality
- **date-fns** - Date utility library

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd taskhive
```

### 2. Backend Setup
```bash
cd taskhive_backend
npm install
```

Create a `.env` file in the `taskhive_backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskhive
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd ../taskhive_frontend
npm install
```

### 4. Start the Application

#### Development Mode (Recommended)
```bash
# Terminal 1 - Backend
cd taskhive_backend
npm run dev

# Terminal 2 - Frontend
cd taskhive_frontend
npm run dev
```

#### Production Mode
```bash
# Backend
cd taskhive_backend
npm start

# Frontend
cd taskhive_frontend
npm run build
npm run preview
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 📖 Usage

### User Registration & Login
1. Open the application in your browser
2. Register a new account or login with existing credentials
3. Access the dashboard to start managing tasks

### Creating Tasks
1. Navigate to the Dashboard
2. Click "Add Task" to create a new task
3. Fill in task details and assign to a board

### Managing Boards
1. Create new boards for different projects
2. Organize tasks within boards
3. Use drag-and-drop to move tasks between columns

### Collaboration
- Add comments to tasks for team communication
- Share boards with team members
- Track task progress in real-time

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Boards
- `GET /api/boards` - Get all boards
- `POST /api/boards` - Create new board
- `GET /api/boards/:id` - Get board by ID
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Comments
- `GET /api/comments/:taskId` - Get comments for a task
- `POST /api/comments/:taskId` - Add comment to task
- `DELETE /api/comments/:id` - Delete comment

## 📁 Project Structure

```
taskhive/
├── taskhive_backend/          # Backend application
│   ├── config/               # Database configuration
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   └── server.js            # Application entry point
├── taskhive_frontend/        # Frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── App.jsx          # Main application component
│   └── index.html           # HTML template
└── README.md                # Project documentation
```

## 🧪 Development Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run server` - Alias for development server

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT authentication
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Error handling middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskhive
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👥 Support

For support, email [your-email@example.com] or create an issue in the repository.

## 🔄 Recent Updates

- Enhanced drag-and-drop functionality
- Improved error handling
- Added rate limiting for API protection
- Mobile-responsive design improvements
- Real-time task updates

---

**TaskHive** - Streamline your workflow with modern task management.
