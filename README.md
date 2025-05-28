# Office Supplies E-commerce Platform

A modern e-commerce platform for office supplies and stationery built with the MERN stack (MongoDB, Express, React, Node.js) and ShadCN UI.

## Features

### User Features
- Dynamic product listing with filtering and search
- Product details with image gallery
- Cart and wishlist functionality
- User login/signup with JWT authentication
- Checkout process with dummy payment flow
- Light/Dark mode support
- Fully responsive design across all devices
- Skeleton loaders and lazy loading
- Neumorphic/minimal aesthetic

### Admin Features
- Admin dashboard
- Product management (CRUD operations)
- Order management
- User management

## Tech Stack

### Frontend
- React with Vite
- ShadCN UI components
- TailwindCSS for styling
- React Router for navigation
- Context API for state management
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/office-supplies-ecom.git
cd office-supplies-ecom
```

2. Install backend dependencies
```
cd backend
npm install
```

3. Install frontend dependencies
```
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

5. Run the development servers

Backend:
```
cd backend
npm run dev
```

Frontend:
```
cd frontend
npm run dev
```

## Project Structure

```
office-supplies-ecom/
├── frontend/                # React frontend
│   ├── public/              # Public assets
│   └── src/
│       ├── components/      # Reusable components
│       ├── context/         # Context providers
│       ├── lib/             # Utility functions
│       └── pages/           # Page components
├── backend/
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   └── utils/               # Utility functions
└── uploads/                 # Uploaded files
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create a product (Admin)
- `PUT /api/products/:id` - Update a product (Admin)
- `DELETE /api/products/:id` - Delete a product (Admin)
- `GET /api/products/top` - Get top rated products
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products/:id/reviews` - Create product review

### Users
- `POST /api/users/login` - Authenticate user
- `POST /api/users/register` - Register user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users` - Get all users (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get logged in user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order to paid
- `PUT /api/orders/:id/deliver` - Update order to delivered
- `GET /api/orders` - Get all orders (Admin)

## License

This project is licensed under the MIT License. 