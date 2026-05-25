# Elore Jewels

Elore Jewels is a premium, high-converting E-commerce application for an online fashion jewelry brand. Built on the **MERN Stack**, it features a modern, elegant, and highly functional user interface on the frontend, powered by a robust and scalable Express API on the backend.

## Tech Stack

### Frontend (Client)
- **Framework:** React + Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM v6
- **State Management:** React Context (CartContext)
- **Icons:** React Icons

### Backend (Server)
- **Runtime & Framework:** Node.js + Express.js
- **Database & ODM:** MongoDB Atlas + Mongoose
- **Authentication:** JWT (JSON Web Tokens) with Access & Refresh tokens
- **Storage:** AWS S3 (via `@aws-sdk/client-s3` and `multer-s3`) for product media and avatars
- **Payments:** Stripe Gateway integration
- **Email:** Nodemailer (SMTP)

## Features

- **Responsive Design:** Mobile-first approach ensuring a seamless experience across all devices.
- **Robust Authentication:** Secure user registration, login, and token rotation using HTTP-only cookies and JWTs.
- **Product & Category Management:** Complete catalog functionality with filtering, searching, and sub-categorization.
- **Shopping Cart & Checkout:** Interactive Slide-Out Cart Drawer and a seamless 3-step checkout process integrated with Stripe for secure payments.
- **Order Tracking:** Users can view order history and track the status of current orders.
- **Reviews & Ratings:** Authenticated users can leave reviews and ratings on products they have purchased.
- **Media Uploads:** Direct upload of product images and user avatars to an AWS S3 bucket.
- **Email & SMS Notifications:** Automated alerts for order confirmation, shipping updates, and promotions.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Atlas or local)
- An AWS Account (for S3)
- A Stripe Developer Account

### 1. Server Setup

Navigate to the `server` directory and install dependencies:
```bash
cd server
npm install
```

Configure your environment variables:
1. Create a `.env` file in the `server` directory (you can copy `.env.example`).
2. Update the variables with your own credentials (MongoDB URI, JWT Secrets, AWS Keys, Stripe Secret).

Start the backend server (runs on `http://localhost:5000` by default):
```bash
npm run dev
```

### 2. Client Setup

Open a new terminal tab, navigate to the `client` directory, and install dependencies:
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
```

Navigate to `http://localhost:5173` in your web browser to view the application!

## Project Structure

### `/server`
- `config/`: Database and logger configurations
- `controllers/`: Route handlers mapping to business logic
- `middleware/`: Global error handlers, route protection (auth), and rate limiting
- `models/`: Mongoose schemas (Users, Products, Categories, Orders, Reviews, Notifications)
- `routes/`: API endpoint definitions

### `/client`
- `src/components/`: Reusable UI components (Header, Footer, CartDrawer, Layout)
- `src/pages/`: Page-level components (Home, PLP, PDP, Cart, Checkout)
- `src/context/`: Global state management
- `public/`: Static assets and mock data (if the backend is not yet populated)
