# Nyeri Stays Backend API

A comprehensive REST API for the Nyeri Stays accommodation booking platform built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User, Host, Admin)
  - Email verification
  - Password reset functionality
  - Profile management

- **Property Management**
  - CRUD operations for properties
  - Advanced search and filtering
  - Image upload support
  - Rating and review system
  - Property statistics

- **User Management**
  - User registration and login
  - Profile updates
  - Admin user management
  - User statistics

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install additional dependencies**
   ```bash
   npm install cors
   ```

4. **Create environment file**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/nyeri-stays

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d

   # Email Configuration
   EMAIL_FROM=campusroomske@gmail.com
   EMAIL_PASSWORD=your-email-password

   # Frontend URL
   FRONTEND_URL=http://localhost:5173

   # File Upload
   MAX_FILE_SIZE=5242880
   ```

5. **Start the server**
   ```bash
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+254700000000",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password/:token
Content-Type: application/json

{
  "password": "newpassword123"
}
```

### Property Endpoints

#### Get All Properties
```http
GET /api/properties?page=1&limit=10&search=nyeri&minPrice=50&maxPrice=200
```

#### Get Featured Properties
```http
GET /api/properties/featured?limit=6
```

#### Get Single Property
```http
GET /api/properties/:id
```

#### Create Property (Host/Admin only)
```http
POST /api/properties
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Luxury Villa with Mountain View",
  "description": "Beautiful villa with stunning mountain views",
  "type": "villa",
  "location": {
    "address": "123 Mountain Road",
    "city": "Nyeri",
    "state": "Nyeri County"
  },
  "pricing": {
    "pricePerNight": 150
  },
  "capacity": {
    "bedrooms": 3,
    "bathrooms": 2,
    "maxGuests": 6
  },
  "amenities": ["WiFi", "Kitchen", "Pool"]
}
```

#### Update Property
```http
PUT /api/properties/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Villa Title"
}
```

#### Delete Property
```http
DELETE /api/properties/:id
Authorization: Bearer <token>
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+254700000001"
}
```

#### Get All Users (Admin only)
```http
GET /api/users?page=1&limit=10&role=host
Authorization: Bearer <admin-token>
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

- **User**: Basic user with booking capabilities
- **Host**: Can create and manage properties
- **Admin**: Full system access and user management

## 🗄️ Database Models

### User Model
- Personal information (name, email, phone)
- Authentication data (password, tokens)
- Profile settings and preferences
- Role-based permissions

### Property Model
- Property details (title, description, type)
- Location information
- Pricing and capacity
- Amenities and rules
- Ratings and reviews
- Images and media

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/nyeri-stays |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `EMAIL_FROM` | Email sender address | campusroomske@gmail.com |
| `EMAIL_PASSWORD` | Email password | Required |
| `FRONTEND_URL` | Frontend application URL | http://localhost:5173 |

## 🚀 Development

### Running in Development Mode
```bash
npm run dev
```

### Running in Production Mode
```bash
npm start
```

### Health Check
```http
GET /api/health
```

## 📝 TODO

- [ ] Implement email sending functionality
- [ ] Add image upload with Multer
- [ ] Implement booking system
- [ ] Add payment integration
- [ ] Add real-time notifications
- [ ] Implement caching with Redis
- [ ] Add API rate limiting
- [ ] Add comprehensive logging
- [ ] Add unit and integration tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email info@nyeristays.com or create an issue in the repository. 