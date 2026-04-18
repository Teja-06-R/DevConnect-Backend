# DevConnect 🚀

**A developer networking platform — like Tinder, but for developers.**  
Discover developers, send connection requests, accept or reject them with a swipe, and chat in real time.

🔗 **Live Demo:** [dev-connect-ten-nu.vercel.app](https://dev-connect-ten-nu.vercel.app/login)  
📦 **Frontend Repo:** [DevConnect-Frontend](https://github.com/Teja-06-R/DevConnect-Frontend)

---

## Features

- 🔐 **JWT Authentication** — Secure login/signup with tokens stored in HTTP-only cookies
- 🔄 **Connection System** — Send, accept, and reject developer connection requests
- 👆 **Swipe UI** — Tinder-style swipe to connect or skip developers
- 💬 **Real-time Chat** — Instant messaging between matched developers using Socket.io
- 🛡️ **Password Hashing** — bcrypt-based secure password storage
- ✅ **Input Validation** — Server-side validation using the `validator` library
- 📧 **Email Notifications** — Nodemailer integration for connection alerts
- ⏰ **Cron Jobs** — Scheduled tasks using node-cron

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js v5 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Real-time | Socket.io |
| Validation | validator.js |
| Email | Nodemailer |
| Scheduling | node-cron |

---

## Project Structure

```
src/
├── app.js              # Entry point
├── config/
│   └── database.js     # MongoDB connection
├── models/
│   ├── user.js         # User schema
│   └── connectionRequest.js  # Connection request schema
├── routes/
│   ├── auth.js         # Login, signup, logout
│   ├── profile.js      # View & edit profile
│   ├── request.js      # Send/accept/reject connections
│   └── user.js         # Feed, matches, connections
├── middlewares/
│   └── auth.js         # JWT verification middleware
└── utils/
    └── validation.js   # Input validation helpers
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login and receive JWT cookie |
| POST | `/auth/logout` | Clear auth cookie |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile/view` | View own profile |
| PATCH | `/profile/edit` | Update profile info |
| PATCH | `/profile/password` | Change password |

### Connection Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/request/send/:status/:userId` | Send interested/ignored request |
| POST | `/request/review/:status/:requestId` | Accept or reject a request |

### User / Feed
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/feed` | Get developers to swipe on |
| GET | `/user/requests/received` | Pending connection requests |
| GET | `/user/connections` | All accepted connections |

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### Installation

```bash
# Clone the repo
git clone https://github.com/Teja-06-R/DevConnect-Backend.git
cd DevConnect-Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

### Run the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:3000`

---

## Frontend

The frontend is built with **React + Redux Toolkit + Tailwind CSS**.  
👉 [DevConnect-Frontend](https://github.com/Teja-06-R/DevConnect-Frontend)

---

## Author

**Himateja Reddi**  
III Year B.Tech — AI & Data Science, SRKR Engineering College  
[LinkedIn](https://linkedin.com/in/himateja-reddi) · [GitHub](https://github.com/Teja-06-R) · [LeetCode](https://leetcode.com/u/27F0)

---

## License

ISC