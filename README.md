# OTUHealthCare

## Authentication API Documentation

### Base URL
`/auth`

### **POST /auth/register**

#### Description
Register a new user with email, username, and password.

#### Request
- **Method**: `POST`
- **Endpoint**: `/auth/register`
- **Headers**: 
  - `Content-Type: application/json`
- **Body**: 
  ```json
  {
    "email": "user@example.com",
    "username": "newuser",
    "password": "securePassword123"
  }
  ```

#### Response
- **200 OK**: User registered successfully.
- **400 Bad Request**: If the registration fails.

```json
{
  "message": "User registered successfully"
}
```

### **POST /auth/login**

#### Description
Authenticate a user and generate a JWT token.

#### Request
- **Method**: `POST`
- **Endpoint**: `/auth/login`
- **Headers**: 
  - `Content-Type: application/json`
- **Body**: 
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```

#### Response
- **200 OK**: Login successful, returns JWT token.
- **401 Unauthorized**: If credentials are invalid.
- **500 Internal Server Error**: If there’s a server issue.

```json
{
  "message": "Login successful",
  "token": "<jwt-token>"
}
```

--- 

## User API Documentation

### Base URL
`/user`

### Authorization
All endpoints (except `/user/all/`) require JWT token authorization via the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

### **GET /user/all/**

#### Description
Fetch all users in the system.

#### Request
- Method: `GET`
- Endpoint: `/user/all/`
- Headers: 
  - `Content-Type: application/json`

#### Response
- **200 OK**: Returns an array of all users.
- **400 Bad Request**: If there’s an error fetching the users.

```json
// Example success response
[
  {
    "email": "user1@example.com",
    "username": "user1",
    "gender": "female",
    "age": 30,
    "height": 160,
    "weight": 55,
    "bloodPressure": { "systolic": 120, "diastolic": 80 },
    "createdAt": "2024-01-01T00:00:00Z"
  },
  // More users...
]
```

### **GET /user/**

#### Description
Fetch the current authenticated user's details.

#### Request
- Method: `GET`
- Endpoint: `/user/`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer <your-jwt-token>`

#### Response
- **200 OK**: Returns the authenticated user's data.
- **404 Not Found**: If the user does not exist.
- **500 Internal Server Error**: If there’s a server error.

```json
// Example success response
{
  "email": "user1@example.com",
  "username": "user1",
  "gender": "female",
  "age": 30,
  "height": 160,
  "weight": 55,
  "bloodPressure": { "systolic": 120, "diastolic": 80 },
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### **PUT /user/**

#### Description
Update the authenticated user's profile.

#### Request
- Method: `PUT`
- Endpoint: `/user/`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <your-jwt-token>`
- Body: JSON object with fields to update (e.g., `age`, `height`, `weight`).

```json
// Example request body
{
  "age": 31,
  "height": 165,
  "weight": 56
}
```

#### Response
- **200 OK**: Returns the updated user data.
- **404 Not Found**: If the user does not exist.
- **400 Bad Request**: If there’s an issue with the data.
  
```json
// Example success response
{
  "email": "user1@example.com",
  "username": "user1",
  "gender": "female",
  "age": 31,
  "height": 165,
  "weight": 56,
  "bloodPressure": { "systolic": 120, "diastolic": 80 },
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### **DELETE /user/**

#### Description
Delete the authenticated user's profile.

#### Request
- Method: `DELETE`
- Endpoint: `/user/`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <your-jwt-token>`

#### Response
- **204 No Content**: The user has been deleted successfully.
- **404 Not Found**: If the user does not exist.
- **500 Internal Server Error**: If there’s an error.

--- 

## Chat API Documentation

### Base URL
`/chat`

### Authorization
The `/chat` route requires JWT token authorization via the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

### **GET /chat**

#### Description
Send a message to the health advice chatbot. The response will include health advice based on the user's input and their health information.

#### Request
- **Method**: `GET`
- **Endpoint**: `/chat`
- **Query Parameters**:
  - `message`: The message or query to send (optional, default: `'hi'`).
  - `email`: The email of the authenticated user (optional).

#### Response
- **200 OK**: Returns health advice based on the user's information or input.

```json
{
  "response": "Here is your health advice based on your inputs."
}
```