# 💬 Talkify - Real-Time Chat Application

<div align="center">
  
![Talkify Logo](https://img.shields.io/badge/Talkify-Connect%20%26%20Chat-22c55e?style=for-the-badge&logo=chat&logoColor=white)

**A modern, feature-rich real-time chat application built with React and Node.js**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Screenshots](#-screenshots)

</div>

---

## 🌟 Overview

Talkify is a modern, secure, and feature-rich real-time chat application that enables seamless communication between users. Built with cutting-edge technologies, it offers instant messaging, group chats, media sharing, and a beautiful, responsive UI with a stunning emerald-teal glassmorphism design.

### ✨ Key Highlights

- 🚀 **Real-time messaging** with Socket.io
- 🔒 **Secure authentication** with JWT and Google OAuth
- 👥 **Group chats** and direct messaging
- 📸 **Media sharing** with interactive image gallery
- 🎨 **Modern glassmorphism UI** with smooth animations
- 📱 **Fully responsive** design for all devices
- ⚡ **Lightning fast** with optimized performance
- 🌐 **Always online** with instant synchronization

---

## 🎯 Features

### 💬 Core Messaging
- ✅ **Real-time instant messaging** - Messages delivered instantly
- ✅ **Private conversations** - One-on-one secure chats
- ✅ **Group chats** - Create groups with multiple participants
- ✅ **Message status** - Sent, delivered, and read indicators
- ✅ **Typing indicators** - See when someone is typing
- ✅ **Online status** - Real-time presence detection
- ✅ **Message timestamps** - Track when messages were sent

### 📸 Media & Gallery
- ✅ **Image sharing** - Upload and share multiple images
- ✅ **Image preview** - See thumbnails before sending
- ✅ **Gallery view** - Browse all conversation images
- ✅ **Grid layouts** - Switch between 2 or 3 column views
- ✅ **Lightbox viewer** - Full-screen image viewing
- ✅ **Image navigation** - Browse images with arrows/keyboard
- ✅ **Download images** - Save images locally
- ✅ **Search gallery** - Find images by date or sender

### 👥 User Management
- ✅ **Email authentication** - Sign up with email/password
- ✅ **Google OAuth** - Quick login with Google
- ✅ **Profile management** - Update name and avatar
- ✅ **Avatar uploads** - Custom profile pictures
- ✅ **User status** - Online, Offline, Away indicators
- ✅ **User search** - Find and connect with users

### 🎨 UI/UX Excellence
- ✅ **Glassmorphism design** - Modern frosted glass effects
- ✅ **Dark theme** - Easy on the eyes with emerald-teal accents
- ✅ **Smooth animations** - Slide-ins, fades, and transitions
- ✅ **Responsive layout** - Perfect on mobile, tablet, and desktop
- ✅ **Intuitive navigation** - Easy to use interface
- ✅ **Toast notifications** - Non-intrusive alerts
- ✅ **Loading states** - Skeleton screens and spinners
- ✅ **Empty states** - Helpful messages when no content

### 🔐 Security & Privacy
- ✅ **JWT authentication** - Secure token-based auth
- ✅ **Password hashing** - Bcrypt encryption
- ✅ **Protected routes** - Authorization checks
- ✅ **Session management** - Secure user sessions
- ✅ **CORS protection** - Cross-origin security
- ✅ **Input validation** - Prevent malicious data

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework for building components |
| **React Router DOM** | Client-side routing and navigation |
| **Redux Toolkit** | Global state management |
| **TanStack Query** | Data fetching, caching, and synchronization |
| **Socket.io Client** | Real-time bidirectional communication |
| **Tailwind CSS** | Utility-first CSS framework |
| **Lucide React** | Beautiful icon library |
| **Axios** | HTTP client for API requests |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web application framework |
| **Socket.io** | WebSocket server for real-time events |
| **PostgreSQL** | Relational database |
| **JWT** | JSON Web Tokens for authentication |
| **Bcrypt** | Password hashing library |
| **Multer** | File upload middleware |
| **Passport.js** | Authentication middleware with OAuth |

### DevOps & Tools
- **Git** - Version control
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Vite** - Frontend build tool

---

## 📦 Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn package manager
- PostgreSQL (v12 or higher)
- Git

### Step 1: Clone the Repository
```bash
git clone [[https://github.com/yourusername/talkify.git]](https://github.com/PrathamSachan91/Talkify_frontend.git)
cd talkify
```

### Step 2: Install Dependencies

**Frontend:**
```bash
cd client
npm install
```

**Backend:**
```bash
cd ../server
npm install
```

### Step 3: Environment Configuration

**Frontend (.env):**
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```

**Backend (.env):**
Create a `.env` file in the `server` directory:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/talkify

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# Client URL
CLIENT_URL=http://localhost:5173

# File Upload Settings
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

### Step 4: Database Setup

**Create PostgreSQL database:**
```bash
createdb talkify
```

**Run database migrations:**
```bash
cd server
npm run migrate
# or
npx sequelize-cli db:migrate
```

**Seed initial data (optional):**
```bash
npm run seed
```

### Step 5: Start the Application

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend Client:**
```bash
cd client
npm run dev
```

The application will be running at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Socket.io:** ws://localhost:3001

---

## 🚀 Usage

### Getting Started

#### 1. Authentication
- **Sign Up:** Create a new account with email and password
- **Login:** Use your credentials or sign in with Google
- **Profile:** Upload an avatar and set your display name

#### 2. Start Chatting
- **Direct Messages:** Click on any user in the sidebar to start a private conversation
- **Group Chats:** Click "Create New Group" button, name your group, and select members
- **Send Messages:** Type your message and press Enter or click the Send button

#### 3. Share Images
- Click the **paperclip icon** to attach images
- Select one or multiple images (max 5MB each)
- Preview images before sending
- Click Send to share with the conversation

#### 4. Browse Gallery
- Open any conversation
- Click the **gallery icon** in the chat header
- Browse all shared images in a beautiful grid layout
- Use the **search bar** to find images by date or sender
- Toggle between **2 or 3 column** grid views
- Click any image for **full-screen viewing**
- Use **arrow keys** or navigation buttons to browse
- Click **download** to save images

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Esc` | Close lightbox/modal |
| `←` | Previous image in gallery |
| `→` | Next image in gallery |

---

## 📸 Screenshots

### 🏠 Welcome Screen
Beautiful landing page showcasing key features with modern glassmorphism design.

### 🔐 Authentication
- Clean login interface with email or Google OAuth
- Sign up with secure password validation
- Forgot password functionality

### 💬 Chat Interface
- Real-time messaging with smooth animations
- Message bubbles with sender info
- Typing indicators and online status
- Time stamps on all messages

### 📸 Image Sharing
- Multiple image upload with previews
- Drag and drop support
- Remove images before sending
- Beautiful image display in chat

### 🖼️ Gallery View
- Grid layout with 2 or 3 columns
- Search by date or sender
- Hover effects showing image info
- Download button on each image
- Full-screen lightbox viewer

### 👥 Group Management
- Create groups with custom names
- Select multiple members
- Beautiful member selection UI
- Group avatars and info

### 👤 Profile Management
- Edit display name
- Upload custom avatar
- Real-time profile updates
- Success notifications

---

## 📸 Screenshots

### 🏠 Landing Page
![Landing Page](screenshot/landing.png)
*Beautiful welcome screen with feature highlights and modern glassmorphism design*

---

### 🔐 Authentication
![Login Screen](screenshot/login.png)
*Secure login interface with email authentication and Google OAuth integration*

---

### 💬 Chat Dashboard
![Chat Interface](screenshot/chat.png)
*Real-time messaging with smooth animations, typing indicators, and message delivery status*

---

### 👥 Create Group
![Create Group Modal](screenshot/creategroup.png)
*Easy group creation with member selection and intuitive UI*

---

### 👤 Edit Profile
![Edit Profile Modal](screenshot/edit.png)
*Update profile information, change display name, and upload custom avatar*

---

### 🖼️ Image Gallery
![Gallery View](screenshot/gallery.png)
*Browse all shared images in a beautiful grid layout with search functionality and lightbox viewer*

---

## 📁 Project Structure

```
talkify/
├── client/                     # Frontend React Application
│   ├── public/                 # Static files
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Chat/          # Chat-related components
│   │   │   ├── Navbar/        # Navigation components
│   │   │   ├── Sidebar/       # Sidebar components
│   │   │   └── Modals/        # Modal dialogs
│   │   ├── pages/             # Page components
│   │   │   ├── Home/          # Home page
│   │   │   ├── Login/         # Login page
│   │   │   ├── Register/      # Registration page
│   │   │   └── Gallery/       # Image gallery
│   │   ├── redux/             # Redux store
│   │   │   ├── store.js       # Store configuration
│   │   │   └── slices/        # Redux slices
│   │   ├── api/               # API configuration
│   │   ├── socket/            # Socket.io setup
│   │   ├── utils/             # Utility functions
│   │   ├── assets/            # Images, fonts, etc.
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                     # Backend Node.js Application
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── chatController.js
│   │   │   └── userController.js
│   │   ├── models/            # Database models
│   │   │   ├── User.js
│   │   │   ├── Conversation.js
│   │   │   └── Message.js
│   │   ├── routes/            # API routes
│   │   │   ├── auth.js
│   │   │   ├── chat.js
│   │   │   └── user.js
│   │   ├── middleware/        # Custom middleware
│   │   │   ├── auth.js
│   │   │   └── upload.js
│   │   ├── socket/            # Socket.io handlers
│   │   │   └── chatSocket.js
│   │   ├── config/            # Configuration
│   │   │   ├── database.js
│   │   │   └── passport.js
│   │   ├── utils/             # Helper functions
│   │   └── server.js          # Entry point
│   ├── uploads/               # Uploaded files
│   ├── migrations/            # Database migrations
│   ├── seeders/               # Database seeds
│   ├── package.json
│   └── .env
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🎨 Customization

### Theme Customization
Talkify uses CSS custom properties for easy theming. Edit your CSS file:

```css
:root {
  /* Background Gradients */
  --bg-gradient-start: #0a0e1a;
  --bg-gradient-mid: #0d3330;
  --bg-gradient-end: #0a0e1a;
  
  /* Glass Effect Colors */
  --bg-card: rgba(13, 51, 48, 0.4);
  --bg-input: rgba(5, 46, 43, 0.6);
  
  /* Text Colors */
  --text-main: #f0fdf4;
  --text-muted: #94a3b8;
  --text-label: #5eead4;
  
  /* Accent Colors */
  --accent-primary: #10b981;
  --accent-secondary: #2dd4bf;
  
  /* Status Colors */
  --success: #22c55e;
  --danger: #f87171;
  --online: #22c55e;
}
```

### Socket.io Events
Custom events used in the application:

```javascript
// Client to Server
socket.emit('join_conversation', conversationId);
socket.emit('send_message', messageData);
socket.emit('typing', { conversationId, userId });

// Server to Client
socket.on('receive_message', (message) => {});
socket.on('user_typing', (data) => {});
socket.on('user_status', (status) => {});
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Process
1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/yourusername/talkify.git`
3. **Create** a feature branch: `git checkout -b feature/AmazingFeature`
4. **Make** your changes
5. **Test** thoroughly
6. **Commit**: `git commit -m 'Add some AmazingFeature'`
7. **Push**: `git push origin feature/AmazingFeature`
8. **Open** a Pull Request

### Coding Guidelines
- Follow existing code style and conventions
- Write clear, descriptive commit messages
- Add comments for complex logic
- Update documentation for new features
- Write tests for new functionality
- Ensure all tests pass before submitting PR

### Bug Reports
Found a bug? Please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser, versions)

---

## 🐛 Known Issues

- Voice and video calling features are under development
- File sharing is currently limited to images only
- Message editing functionality not yet implemented
- Search could be optimized for large conversation histories

---

## 🗺️ Roadmap

### v2.0 - Planned Features
- [ ] Voice calls with WebRTC
- [ ] Video calls support
- [ ] Screen sharing capability
- [ ] File sharing (PDF, DOC, ZIP, etc.)
- [ ] Message reactions with emoji picker
- [ ] Edit and delete messages
- [ ] Reply to specific messages
- [ ] Message forwarding

### v3.0 - Future Plans
- [ ] Read receipts for group chats
- [ ] Push notifications (Web & Mobile)
- [ ] Desktop app with Electron
- [ ] Native mobile apps (React Native)
- [ ] Message search within conversations
- [ ] User blocking and reporting
- [ ] Admin dashboard
- [ ] Analytics and insights
- [ ] Bot integrations
- [ ] Custom themes
- [ ] Dark/Light mode toggle
- [ ] Multiple language support

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Talkify

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software")...
```

---

## 👨‍💻 Author

**Pratham Sachan**

- 💼 LinkedIn: [linkedin.com/in/yourprofile](https://www.linkedin.com/in/prathamsachan8756924/))
- 🐙 GitHub: [@yourusername](https://github.com/PrathamSachan91)
- 📧 Email: prathamsachan6886@gmail.com

---


## 📊 Project Stats

### 🔐 Authentication
![Login](screenshots/login.png)

### 📊 Dashboard
![Dashboard](screenshots/dashboard.png)
![Dashboard](screenshots/chat.png)
![Dashboard](screenshots/creategroup)
![Dashboard](screenshots/edit)
![Dashboard](screenshots/gallery.png)
![Dashboard](screenshots/landing.png)

---
