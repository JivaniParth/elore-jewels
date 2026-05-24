# Elore Jewels

Elore Jewels is a premium, high-converting E-commerce UI/UX for an online fashion jewelry brand. The design is modern, clean, and highly functional, blending traditional elegance with contemporary fashion.

## Tech Stack
- **Framework:** React + Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM
- **Icons:** React Icons

## Features
- **Responsive Design:** Mobile-first approach ensuring a seamless experience across all devices.
- **Dynamic Data Mocking:** Products are fetched from a mock JSON API (`public/data.json`) to simulate real-world data fetching without hardcoding.
- **Global State Management:** A React Context (`CartContext`) manages the shopping cart state, including an interactive Slide-Out Cart Drawer.
- **Core Pages Built:**
  - **Homepage:** Hero banner, category quick links, and a trending section.
  - **Product Listing Page (PLP):** Advanced product grid with functional "Load More" pagination simulating network delays.
  - **Product Detail Page (PDP):** Interactive media gallery, Urgency Triggers, and detailed product accordions.
  - **Cart & Checkout:** Split-screen cart with a free-shipping progress bar, and a minimalist 3-step checkout flow.

## Getting Started

To run the project locally, follow these steps:

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173` in your web browser.

## Project Structure
- `client/src/components/`: Reusable UI components (Header, Footer, CartDrawer, Layout)
- `client/src/pages/`: Page-level components (Home, PLP, PDP, Cart, Checkout)
- `client/src/context/`: Global state management (CartContext)
- `client/public/`: Static assets and the `data.json` mock database.
