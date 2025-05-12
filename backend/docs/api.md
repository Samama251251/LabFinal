# API Documentation

## Authentication API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Rate Limiting
All authentication routes are rate-limited:
- Window: 15 minutes
- Max Requests: 5 per IP
- Error Response: "Too many requests from this IP, please try again after 15 minutes"

### Response Format
All API responses follow this format:
```json
{
  "success": boolean,
  "data": object | null,
  "error": string | null
}
```

## Endpoints

### 1. User Registration
Register a new user account.

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation:**
- Name: Required
- Email: Required, must be unique and valid format
- Password: Required, minimum 6 characters

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "timestamp",
    "updatedAt": "timestamp",
    "token": "jwt_token"
  }
}
```

**Error Responses:**
- `400`: User already exists
- `500`: Server error during signup

### 2. User Login
Authenticate a user and receive a JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "timestamp",
    "updatedAt": "timestamp",
    "token": "jwt_token"
  }
}
```

**Error Responses:**
- `401`: Invalid credentials
- `500`: Server error during login

### 3. Get Current User
Get the profile of the currently authenticated user.

**Endpoint:** `GET /auth/me`

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Responses:**
- `401`: Not authorized, token failed
- `401`: Not authorized, no token
- `500`: Server error while fetching user data

## Authentication

### JWT Token
- Tokens are valid for 24 hours
- Must be included in the Authorization header for protected routes
- Format: `Bearer <token>`

### Protected Routes
Protected routes require a valid JWT token in the Authorization header.

### Admin Routes
Some routes may require admin privileges. The user must have `role: "admin"` to access these routes.

## Error Handling

### Common Error Codes
- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Invalid/missing authentication
- `403`: Forbidden - Insufficient permissions
- `500`: Server Error - Internal server error

### Error Response Format
```json
{
  "success": false,
  "error": "Error message description"
}
```

## Security Features

### Password Security
- Passwords are hashed using bcrypt
- Minimum password length: 6 characters
- Password is never returned in responses

### Headers Security
- Uses Helmet for secure headers
- CORS enabled for frontend origin
- Rate limiting on authentication routes

## Development

### Environment Variables
Required environment variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/iot-dashboard
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
```

### Running the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```
