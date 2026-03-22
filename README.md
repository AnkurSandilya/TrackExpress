# 🚚 TrackExpress – Parcel Tracking System

## 📌 Overview

TrackExpress is a full-stack web application that allows users to book parcels, track delivery status, and manage shipments.
It also includes an Admin Panel to manage parcels and update delivery status.

---

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

---

## ✨ Features

* User Authentication (Login / Register)
* Parcel Booking System
* Parcel Tracking using Tracking ID
* Admin Dashboard for parcel management
* Parcel Status Updates

---

## 📂 Project Structure

```
TrackExpress/
│
├── backend/        # Backend (API & database)
├── frontend/       # Frontend (React UI)
│
├── README.md
└── .gitignore
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/AnkurSandilya/TrackExpress.git
cd TrackExpress
```

---

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file inside the backend folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 🌐 API Endpoints (Basic)

* POST /api/auth/login
* POST /api/auth/register
* POST /api/parcel/book
* GET /api/parcel/:id

---

## 🚀 Future Improvements

* Live parcel tracking (real-time updates)
* Payment integration
* Email/SMS notifications
* Improved UI/UX


## 👨‍💻 Authors

Ankur Kumar
Saurav Mishra
Vivek Raj

---

## ⭐ If you like this project

Give it a star on GitHub ⭐
