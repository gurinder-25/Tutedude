# Backend Component of Assessment

## Overview

This is the backend code for assessment given by Tutedude. It provides the following functionalities:

1. **Authentication**: User signup and login with password hashing and JWT-based authentication.
2. **Friend Management**:
   - Search for users.
   - Send friend requests.
   - Accept or reject friend requests.
3. **Recommendations**:
   - Suggest mutual friends.

## Project Structure

```
server
|-- middleware
|   |-- auth.js          # Middleware for JWT-based authentication
|-- models
|   |-- User.js          # Mongoose schema and model for User
|-- node_modules         # Dependencies installed via npm
|-- routes
|   |-- auth.js          # Routes for user signup and login
|   |-- friend.js        # Routes for managing friend requests
|   |-- recommendation.js # Routes for recommending mutual friends
|-- .env                 # Environment variables (e.g., MongoDB URI, JWT secret)
|-- index.js             # Entry point for the application
|-- package.json         # Project metadata and dependencies
|-- package-lock.json    # Dependency tree lock file
```

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or above)
- [MongoDB](https://www.mongodb.com/) (local or cloud-based, e.g., MongoDB Atlas)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory and add the following:

   ```env
   MONGO_URI=<mongo-uri>
   JWT_SECRET=<jwt-secret>
   PORT=5000
   ```

   Replace `<mongo-uri>` and `<jwt-secret>` with your actual values.

4. Start the server:

   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000` by default. [In the code it is running on 'https://tutedude-alsl.onrender.com']

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint    | Description               |
|--------|-------------|---------------------------|
| POST   | `/signup`   | Create a new user account |
| POST   | `/login`    | Authenticate and log in a user |

**Sample Request: Signup**

```json
{
  "username": "john_doe",
  "password": "mypassword",
  "interests": ["coding", "reading"]
}
```

**Sample Response: Signup**

```
User created
```

**Sample Request: Login**

```json
{
  "username": "john_doe",
  "password": "mypassword"
}
```

**Sample Response: Login**

```json
{
  "token": "<JWT_TOKEN>"
}
```

### Friend Management Routes (`/api/friend`)

| Method | Endpoint         | Description                |
|--------|------------------|----------------------------|
| GET    | `/search`        | Search for users by query  |
| POST   | `/send-request`  | Send a friend request      |
| POST   | `/respond-request` | Accept or reject requests |

**Sample Request: Search Users**

```http
GET /api/friend/search?query=john
Authorization: Bearer <JWT_TOKEN>
```

**Sample Response: Search Users**

```json
[
  {
    "_id": "61234567890abcdef",
    "username": "john_doe"
  }
]
```

**Sample Request: Send Friend Request**

```json
{
  "recipientId": "61234567890abcdef"
}
```

**Sample Response: Send Friend Request**

```
Friend request sent
```

**Sample Request: Respond to Friend Request**

```json
{
  "senderId": "61234567890abcdef",
  "accept": true
}
```

**Sample Response: Respond to Friend Request**

```
Friend request processed
```

### Recommendation Routes (`/api/recommendation`)

| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| GET    | `/mutual-friends`  | Retrieve mutual friends  |

**Sample Request: Get Mutual Friends**

```http
GET /api/recommendation/mutual-friends
Authorization: Bearer <JWT_TOKEN>
```

**Sample Response: Get Mutual Friends**

```json
{
  "jane_doe": 2,
  "bob_smith": 1
}
```

## Middleware

### `auth.js`

The `authenticate` middleware ensures that protected routes are accessible only to authenticated users by verifying the provided JWT token. If the token is valid, the user's ID is attached to the `req` object for further use.

## Models

### `User.js`

The User schema defines the structure of user data:

```javascript
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  interests: [String],
});
```

## Dependencies

- `bcrypt`: For hashing passwords.
- `jsonwebtoken`: For generating and verifying JWT tokens.
- `mongoose`: For interacting with the MongoDB database.
- `dotenv`: For environment variable management.
- `cors`: For handling cross-origin requests.
- `express`: For building the backend API.
