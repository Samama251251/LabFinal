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

## Authentication Endpoints

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

## Device Data Endpoints

### 1. Get Latest Device Data
Get the most recent device data entries (limited to 10).

**Endpoint:** `GET /data/latest`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "data_id",
      "deviceId": "device001",
      "temperature": 25.4,
      "humidity": 48.7,
      "timestamp": "2023-05-25T10:30:00.000Z",
      "createdAt": "2023-05-25T10:30:00.000Z",
      "updatedAt": "2023-05-25T10:30:00.000Z"
    },
    // More data entries...
  ]
}
```

**Error Responses:**
- `500`: Server error while fetching device data

### 2. Get Device Data by Device ID
Get data entries for a specific device (limited to 20).

**Endpoint:** `GET /data/device/:deviceId`

**URL Parameters:**
- `deviceId`: ID of the device to get data for

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "data_id",
      "deviceId": "device001",
      "temperature": 25.4,
      "humidity": 48.7,
      "timestamp": "2023-05-25T10:30:00.000Z",
      "createdAt": "2023-05-25T10:30:00.000Z",
      "updatedAt": "2023-05-25T10:30:00.000Z"
    },
    // More data entries...
  ]
}
```

**Error Responses:**
- `500`: Server error while fetching device data

### 3. Create Device Data
Add a new device data entry (admin only).

**Endpoint:** `POST /data`

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "deviceId": "device001",
  "temperature": 25.4,
  "humidity": 48.7
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "data_id",
    "deviceId": "device001",
    "temperature": 25.4,
    "humidity": 48.7,
    "timestamp": "2023-05-25T10:30:00.000Z",
    "createdAt": "2023-05-25T10:30:00.000Z",
    "updatedAt": "2023-05-25T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Missing required fields
- `401`: Not authorized, token failed
- `403`: Not authorized, admin role required
- `500`: Server error while creating device data

### 4. Delete Device Data
Delete a device data entry by ID (admin only).

**Endpoint:** `DELETE /data/:id`

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

**URL Parameters:**
- `id`: ID of the device data entry to delete

**Success Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

**Error Responses:**
- `401`: Not authorized, token failed
- `403`: Not authorized, admin role required
- `404`: Device data not found
- `500`: Server error while deleting device data

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

# Seed test data
npm run seed
```
