# ⚙️ Chatting App — Backend

The backend for a cross-platform real-time messaging application built with **TypeScript**, **Node.js**, **Express** and **PostgreSQL**.

This repository contains the server-side part of the Chatting App project. It provides the REST API, WebSocket communication, authentication, database access, notifications and file uploads for the Flutter client.

## 🔗 Project Repositories

### ⚙️ Backend

This repository — the TypeScript / Node.js backend.

### 📱 Flutter Client

The client application is implemented with Flutter.

👉 [Chatting App — Flutter](https://github.com/vladimir-matveenko/chatting_app)

### 🌐 Web Version

The Flutter application is also available as a web application:

👉 [Chatting App — Web](https://vladimir-matveenko.github.io/chatting_app/)

## ✨ Features

### 🔐 Authentication

- User registration
- User login
- JWT authentication
- Access and refresh tokens
- Token refresh
- Protected routes
- Password reset flow
- Verification codes for password reset

### 💬 Chats & Messages

- One-to-one chats
- Group chats
- Chat member management
- Message creation
- Message replies
- Message deletion
- Message history
- Read message status
- Unread message tracking

### 🔔 Real-time Communication

WebSocket communication is used for real-time application events.

The backend supports:

- Real-time messages
- Personal user rooms
- Notifications
- Message read status
- User presence
- Chat-related events

### 🔔 Notifications

The notification system supports:

- New message notifications
- Reply notifications
- Chat/member notifications
- Personal notification channels
- Read/unread notification state

### 👤 Users & Profiles

- User management
- Profile updates
- Avatar uploads
- Avatar deletion
- User search

### 📎 File Uploads

The backend supports image uploads for user avatars using `Multer`.

Uploaded files are served through the `/uploads` endpoint.

## 🛠️ Tech Stack

- **TypeScript**
- **Node.js**
- **Express**
- **PostgreSQL**
- **JWT**
- **WebSocket**
- **Multer** — file uploads
- **Swagger / OpenAPI** — API documentation
- **Jest** — testing
- **ESLint**
- **Prettier**

## 🧱 Project Structure

The backend follows a feature-oriented structure:

```text
src/
├── core/
│   ├── container/
│   ├── errors/
│   ├── middleware/
│   ├── ...
│
├── database/
│   ├── migrations/
│   └── ...
│
├── features/
│   ├── auth/
│   ├── users/
│   ├── chats/
│   ├── messages/
│   ├── notifications/
│   └── ...
│
└── scripts/
```

Application functionality is separated into independent features, while shared infrastructure is located in `core/`.

## 🔄 API & WebSocket

The backend exposes a REST API for standard operations and WebSocket endpoints for real-time communication.

```text
                    ┌─────────────────┐
                    │  Flutter Client │
                    │  Android/iOS/Web│
                    └────────┬────────┘
                             │
                  ┌──────────┴──────────┐
                  │                     │
               REST API             WebSocket
                  │                     │
                  └──────────┬──────────┘
                             │
                    ┌────────▼────────┐
                    │    Backend      │
                    │ Node + Express  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL    │
                    └─────────────────┘
```

## 📖 API Documentation

The API is documented using **Swagger / OpenAPI**.

After starting the application locally, Swagger UI is available at:

```text
http://localhost:3000/docs
```

## 🗄️ Database

The application uses **PostgreSQL** as its primary database.

Database schema changes are managed through SQL migrations.

Main entities include:

- Users
- Chats
- Chat members
- Messages
- Notifications
- Password reset codes

## 🧪 Testing

The backend uses **Jest** for automated testing.

Tests cover application services and important business logic, including:

- Authentication
- Token handling
- Password reset
- User operations
- Chat operations
- Message operations
- Notifications

## ⚙️ Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL

### Clone the repository

```bash
git clone https://github.com/vladimir-matveenko/chatting_app_ts.git
cd chatting_app_ts
```

### Install dependencies

```bash
npm install
```

### Environment configuration

Create a `.env` file based on `.env.example` and configure the required environment variables.

Example:

```env
APP_NAME=Chatting App
APP_VERSION=1.0.0
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/chatting_app
JWT_SECRET=your-secret
API_URL=http://localhost:3000
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=user-name
SMTP_PASSWORD=password
SMTP_FROM=Chatting App <noreply@chatting-app.local>
CLOUDINARY_CLOUD_NAME=name
CLOUDINARY_API_KEY=key
CLOUDINARY_API_SECRET=secret
```

### Run database migrations

```bash
npm run migrate
```

### Start the development server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

Swagger documentation:

```text
http://localhost:3000/docs
```

## 🔗 Related Project

👉 [Chatting App — Flutter Client](https://github.com/vladimir-matveenko/chatting_app)

🌐 [Chatting App — Web](https://vladimir-matveenko.github.io/chatting_app/)

## 📌 Project Status

🚧 **Under development**

The backend is actively developed alongside the Flutter client.

---

**Chatting App Backend** — REST API and real-time backend for the Chatting App.
