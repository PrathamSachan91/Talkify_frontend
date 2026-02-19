# 💬 Talkify - Real-Time Chat Application

<div align="center">
  
![Talkify Logo](https://img.shields.io/badge/Talkify-Connect%20%26%20Chat-22c55e?style=for-the-badge&logo=chat&logoColor=white)

**A modern, feature-rich real-time chat application built with React and Node.js**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack-Query-FF4154?style=flat-square&logo=react-query&logoColor=white)](https://tanstack.com/query)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Admin Dashboard](#-admin-dashboard) • [Screenshots](#-screenshots)

</div>

---

## 🌟 Overview

Talkify is a modern, secure, and feature-rich real-time chat application that enables seamless communication between users. Built with cutting-edge technologies, it offers instant messaging, group chats, media sharing, a full-featured admin dashboard, and a beautiful responsive UI with a stunning emerald-teal glassmorphism design.

### ✨ Key Highlights

- 🚀 **Real-time messaging** with Socket.io
- 🔒 **Secure authentication** with JWT and session verification
- 🛡️ **Role-based route protection** — user and admin access levels
- 👥 **Group chats**, broadcasts, and direct messaging
- 📸 **Media sharing** with interactive image gallery
- ✏️ **Message editing and deletion** within a 10-minute window
- 📤 **Message forwarding** to any conversation
- 😀 **Emoji picker** built into the message input
- 🧑‍💼 **Admin dashboard** with user management, group oversight, and conversation analytics
- 🎨 **Modern glassmorphism UI** with smooth animations
- 📱 **Fully responsive** design for all devices
- ⚡ **Optimistic UI updates** for instant feedback

---

## 🎯 Features

### 💬 Core Messaging
- ✅ **Real-time instant messaging** — messages delivered instantly via Socket.io
- ✅ **Private conversations** — one-on-one secure chats
- ✅ **Group chats** — create groups with multiple participants
- ✅ **Broadcast channel** — send announcements to all users
- ✅ **Message status** — sent and delivered indicators
- ✅ **Typing indicators** — see when someone is typing in real time
- ✅ **Online status** — real-time presence detection per user
- ✅ **Message timestamps** — track when every message was sent
- ✅ **Unread badge counts** — per-conversation unread indicators in the sidebar

### ✏️ Message Actions
- ✅ **Edit messages** — modify your own messages within 10 minutes of sending
- ✅ **Delete for everyone** — remove messages for all participants (within 10 minutes)
- ✅ **Delete for me** — hide a message from your own view only
- ✅ **Forward messages** — share a message (text + images) to any conversation
- ✅ **Reply** — reply to specific messages in a thread
- ✅ **Emoji picker** — insert emojis directly from the message input

### 📸 Media & Gallery
- ✅ **Image sharing** — upload and send multiple images
- ✅ **Image previews** — see thumbnails before sending, remove individually
- ✅ **Gallery view** — browse all images shared in a conversation
- ✅ **Grid layouts** — switch between 2 or 3 column views
- ✅ **Lightbox viewer** — full-screen image viewing with navigation
- ✅ **Keyboard navigation** — arrow keys to browse gallery images
- ✅ **Download images** — save images locally
- ✅ **Search gallery** — find images by date or sender

### 👥 User & Group Management
- ✅ **Email authentication** — sign up with email and password
- ✅ **Google OAuth** — quick sign-in with Google
- ✅ **Profile management** — update display name and avatar
- ✅ **Group creation** — name your group and select members
- ✅ **Edit group info** — group owners can update name and avatar
- ✅ **User search** — find and connect with any user
- ✅ **Sidebar ordering** — conversations sorted by most recent activity

### 🛡️ Route Protection
- ✅ **ProtectedRoute** — gates all authenticated routes; redirects to `/login` if not logged in
- ✅ **AdminRoute** — gates `/admin/dashboard`; requires `role === "admin"`, redirects non-admins to `/`
- ✅ **PublicRoute** — prevents logged-in users from accessing `/login` and `/Signin`; redirects to `/`
- ✅ **Session-aware** — uses an `initialized` flag so routes don't flash-redirect during the session check on page refresh

### 🧑‍💼 Admin Dashboard
- ✅ **Overview tab** — stat cards (total users, banned, groups, messages), platform growth line chart, user status donut chart, message breakdown bar chart, recent conversations list
- ✅ **Users tab** — paginated user table with search, filter (all / active / banned), ban/unban toggle with optimistic updates, bulk remove, last active timestamp, online indicator
- ✅ **Groups tab** — group cards with message count, last message preview, created-by info, view and delete actions
- ✅ **Messages tab** — full conversations table with participant names (`User1 ↔ User2` for DMs, group name for groups), message count, type badge, last updated, direct open link
- ✅ **Optimistic ban toggle** — UI updates immediately; reverts on API failure
- ✅ **Confirmation modals** — all destructive actions require confirmation

### 🎨 UI/UX
- ✅ **Glassmorphism design** — modern frosted glass aesthetic
- ✅ **Dark theme** — emerald-teal accent palette
- ✅ **Smooth animations** — tab transitions, message slide-ins, fade-ins
- ✅ **Responsive layout** — adapts across mobile, tablet, and desktop
- ✅ **Skeleton loading** — skeleton screens while data is fetching
- ✅ **Empty states** — helpful messages when lists are empty
- ✅ **Confirmation modals** — for destructive actions across both chat and admin views

### 🔐 Security & Auth
- ✅ **JWT authentication** — secure token-based sessions
- ✅ **`fetchMe` session check** — runs at app root on every page load, sets `initialized` in Redux before any route renders
- ✅ **Password hashing** — Bcrypt encryption
- ✅ **CORS protection** — cross-origin security
- ✅ **Role-based access** — admin-only routes enforced both in routing and UI

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **React Router DOM v6** | Client-side routing with nested protected routes |
| **Redux Toolkit** | Global state — auth (user, isAuthenticated, initialized), online users |
| **TanStack Query** | Data fetching, caching, and optimistic updates |
| **Socket.io Client** | Real-time bidirectional messaging |
| **Tailwind CSS** | Utility-first styling |
| **Lucide React** | Icon library |
| **Emoji Picker React** | In-chat emoji picker |
| **Axios** | HTTP client |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **Socket.io** | WebSocket server |
| **PostgreSQL + Sequelize** | Relational database with ORM |
| **JWT** | Token-based authentication |
| **Bcrypt** | Password hashing |
| **Multer** | File upload middleware |
| **Passport.js** | OAuth middleware |

### DevOps & Tools
- **Vite** — frontend build tool
- **Git** — version control
- **ESLint / Prettier** — linting and formatting

---

## 📦 Installation

### Prerequisites
- Node.js v16+
- npm or yarn
- PostgreSQL v12+
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/PrathamSachan91/Talkify_frontend.git
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

**Frontend (`client/.env`):**
```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```

**Backend (`server/.env`):**
```env
PORT=3001
NODE_ENV=development

DATABASE_URL=postgresql://username:password@localhost:5432/talkify

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

CLIENT_URL=http://localhost:5173

MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

### Step 4: Database Setup

```bash
createdb talkify
cd server
npx sequelize-cli db:migrate
# optional
npx sequelize-cli db:seed:all
```

### Step 5: Run the App

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Socket.io:** ws://localhost:3001

---

## 🚀 Usage

### Authentication
- **Sign Up:** Create an account with email and password at `/Signin`
- **Log In:** Use credentials or Google OAuth at `/login`
- **Logged-in users** are automatically redirected away from `/login` and `/Signin`
- **Page refresh** triggers a `fetchMe` session check — users stay logged in without re-entering credentials

### Chat
- **Direct Messages:** Click any user in the sidebar to open a private conversation
- **Groups:** Click "Create New Group", name the group, and select members
- **Broadcast:** A special channel for announcements (admin-created)
- **Send:** Type a message and press `Enter` or click Send
- **Attach images:** Click the paperclip icon to upload one or multiple images
- **Emoji:** Click the smile icon to open the emoji picker
- **Message actions:** Hover any message to reveal the dropdown — reply, forward, edit (within 10 min), delete for everyone (within 10 min), or delete for me

### Gallery
- Open any conversation → click the gallery icon in the header
- Search by sender or date
- Toggle 2/3 column grid view
- Click any image for full-screen lightbox; use arrow keys or buttons to navigate
- Download any image

### Admin Dashboard (`/admin/dashboard`)
Only accessible to users with `role === "admin"`. Non-admin users navigating there are redirected to `/`.

| Tab | What you can do |
|-----|----------------|
| **Overview** | View platform stats, growth chart, user status breakdown, recent conversations |
| **Users** | Search, filter (all/active/banned), ban/unban, paginate, bulk remove |
| **Groups** | Browse group cards, view message count and last message, delete groups |
| **Messages** | See all conversations with participant names, message count, type, and last updated |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line in message input |
| `Enter` (edit bar) | Save edited message |
| `Escape` | Cancel edit / close lightbox |
| `←` / `→` | Previous / next image in gallery |

---

## 🛡️ Route Architecture

```
App.jsx
├── <AuthInitialized via fetchMe in App>     ← session check runs at root, sets Redux initialized flag
│
├── <PublicRoute>                            ← redirects logged-in users to /
│   ├── /login
│   └── /Signin
│
└── <Static>                                 ← layout shell (Navbar + Sidebar + Footer), shows loader until initialized
    ├── /                                    ← Landing (public, no auth required)
    │
    ├── <ProtectedRoute>                     ← requires isAuthenticated === true
    │   ├── /chat/:conversationId
    │   ├── /image-view
    │   ├── /editProfile
    │   └── /gallery/:conversationId
    │
    └── <AdminRoute>                         ← requires isAuthenticated + role === "admin"
        └── /admin/dashboard
```

**Auth state in Redux:**
```js
{
  user: null | { auth_id, user_name, role, ... },
  isAuthenticated: false | true,
  initialized: false,   // true once fetchMe resolves (success or error)
  loading: false
}
```

`initialized` is the key flag — routes wait for it before making redirect decisions, preventing flash-redirects on page refresh.

---

## 🧑‍💼 Admin Dashboard

The admin dashboard is a fully self-contained analytics and moderation panel at `/admin/dashboard`.

### Backend endpoint required
```js
// GET /admin/conversations
export const fetchAllConversation = async (req, res) => {
  const conversations = await Conversation.findAll({
    attributes: ["conversation_id", "updatedAt", "last_message", "type", "message_count", "group_name", "user1_id", "user2_id"],
    include: [
      { model: Authentication, as: "user1", attributes: ["auth_id", "user_name"] },
      { model: Authentication, as: "user2", attributes: ["auth_id", "user_name"] },
    ],
  });
  return res.json(conversations);
};
```

Sequelize associations needed:
```js
Conversation.belongsTo(Authentication, { foreignKey: "user1_id", as: "user1" });
Conversation.belongsTo(Authentication, { foreignKey: "user2_id", as: "user2" });
```

### User status convention
The DB stores `user_status` as `"Active"` or `"Banned"` (capitalised). The frontend normalises to lowercase for comparisons and sends capitalised values back to the API on ban/unban.

---

## 📁 Project Structure

```
talkify/
├── client/
│   ├── public/
│   └── src/
│       ├── Component/
│       │   ├── Chat/
│       │   │   ├── ChatDashboard.jsx      # Main chat view with message actions
│       │   │   ├── chatGallery.jsx        # Image gallery with lightbox
│       │   │   ├── imageView.jsx          # Full-screen image viewer
│       │   │   └── forwardMessageModal.jsx # Forward message to conversations
│       │   ├── Dashboard/
│       │   │   └── admin.jsx              # Admin dashboard (Overview/Users/Groups/Messages)
│       │   ├── EditProfile/
│       │   │   └── editProfile.jsx        # Edit user or group profile
│       │   ├── Footer/
│       │   ├── Landing/
│       │   ├── Login/
│       │   ├── Navbar/
│       │   ├── Routes/
│       │   │   └── ProtectedRoute.jsx     # ProtectedRoute, AdminRoute, PublicRoute
│       │   ├── Sidebar/
│       │   │   └── Sidebar.jsx            # Conversations list with unread counts
│       │   ├── Signin/
│       │   ├── Static/
│       │   │   └── Static.jsx             # Layout shell — reads initialized from Redux
│       │   ├── Tanstack/
│       │   │   ├── Chatlist.js            # Chat-related API functions
│       │   │   ├── Credential.js          # fetchMe and auth API functions
│       │   │   └── admin.js               # Admin API functions
│       │   └── theme.css                  # CSS custom properties
│       ├── redux/
│       │   ├── store.js
│       │   ├── AuthSlice.js               # auth state with initialized flag
│       │   └── onlineSlice.js             # online users set
│       ├── socket/
│       │   ├── socketContext.jsx
│       │   └── registerSocketHandler.js
│       ├── utils/
│       │   └── background.jpg
│       ├── App.jsx                        # Root — fetchMe session check + route tree
│       └── main.jsx
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── chatController.js
│   │   │   ├── adminController.js
│   │   │   └── userController.js
│   │   ├── models/
│   │   │   ├── Authentication.js
│   │   │   ├── Conversation.js
│   │   │   └── Message.js
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── socket/
│   │   └── config/
│   ├── uploads/
│   ├── migrations/
│   └── package.json
│
└── README.md
```

---

## 🎨 Theme Customization

Talkify uses CSS custom properties. Edit `theme.css` to retheme the entire app:

```css
:root {
  --bg-gradient-start: #0a0e1a;
  --bg-card: rgba(13, 51, 48, 0.4);
  --bg-input: rgba(5, 46, 43, 0.6);

  --text-main: #f0fdf4;
  --text-muted: #94a3b8;
  --text-label: #5eead4;

  --accent-primary: #10b981;
  --accent-secondary: #2dd4bf;

  --danger: #f87171;
  --online: #22c55e;

  --border-main: rgba(255, 255, 255, 0.08);
  --border-focus: #2dd4bf;
}
```

---

## 🔌 Socket.io Events

```js
// Client → Server
socket.emit('join_conversation', conversationId);
socket.emit('typing', { conversationId, userId });

// Server → Client
socket.on('receive_message', (message) => {});
socket.on('user_typing', ({ conversationId, userId }) => {});
socket.on('last_message', ({ conversationId, text, updatedAt, last_sender }) => {});
socket.on('unread_increment', ({ conversationId, senderId }) => {});
socket.on('conversation_read', ({ conversationId }) => {});
socket.on('delete_message', () => {});
socket.on('user_created', (user) => {});
```

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/YourFeature`
3. **Commit** your changes: `git commit -m 'Add YourFeature'`
4. **Push**: `git push origin feature/YourFeature`
5. **Open** a Pull Request

### Guidelines
- Follow existing code conventions
- Write clear commit messages
- Comment complex logic
- Test before submitting a PR

### Bug Reports
Please open an issue with a clear description, steps to reproduce, expected vs actual behavior, and your environment details.

---

## 🗺️ Roadmap

### In Progress / Planned
- [ ] Voice calls with WebRTC
- [ ] Video calls support
- [ ] File sharing (PDF, ZIP, DOC)
- [ ] Reply-to threading (UI wiring complete, backend pending)
- [ ] Read receipts for group chats
- [ ] Push notifications
- [ ] Message search within conversations
- [ ] User blocking and reporting

### Future
- [ ] Native mobile apps (React Native)
- [ ] Desktop app with Electron
- [ ] Light/dark mode toggle
- [ ] Multiple language support
- [ ] Bot integrations
- [ ] Custom themes per user

---

## 📸 Screenshots

### 🏠 Landing Page
![Landing Page](screenshot/landing.png)

### 🔐 Authentication
![Login Screen](screenshot/login.png)

### 💬 Chat Interface
![Chat](screenshot/chat.png)

### 👥 Create Group
![Create Group](screenshot/creategroup.png)

### 👤 Edit Profile
![Edit Profile](screenshot/edit.png)

### 🖼️ Image Gallery
![Gallery](screenshot/gallery.png)

### 🧑‍💼 Admin Dashboard
![Admin Dashboard](screenshot/dashboard.png)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Pratham Sachan**

- 💼 LinkedIn: [linkedin.com/in/prathamsachan8756924](https://www.linkedin.com/in/prathamsachan8756924/)
- 🐙 GitHub: [@PrathamSachan91](https://github.com/PrathamSachan91)
- 📧 Email: prathamsachan6886@gmail.com
