# Authentication API

A Node.js/Express authentication API with email verification, JWT-based sessions, and MongoDB. Easily integrate user authentication into your project.

## Features

- User registration with email verification
- Secure password hashing (bcrypt)
- JWT-based session authentication (stored in HTTP-only cookies)
- User login/logout
- Protected profile route
- MongoDB (Mongoose) user model
- CORS support
- Environment-based configuration

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- nodemailer
- dotenv

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd authentication
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=3000
   MONGO_URL=mongodb://localhost:27017/authentication
   JWT_SECRET=your_jwt_secret
   BASE_URL=http://localhost:3000
   MAILTRAP_HOST=smtp.mailtrap.io
   MAILTRAP_PORT=2525
   SMTP_USER=your_mailtrap_user
   SMTP_PASS=your_mailtrap_pass
   MAILTRAP_SENDEREMAIL=your_sender_email@example.com
   ```

   > Use [Mailtrap](https://mailtrap.io/) for email testing or configure your SMTP provider.

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

All endpoints are prefixed with `/api/v1/users`.

### Register

- **POST** `/register`
- Body: `{ "name": string, "email": string, "password": string }`
- Triggers email verification.

### Verify Email

- **GET** `/verify/:token`
- Verifies user email using the token sent via email.

### Login

- **POST** `/login`
- Body: `{ "email": string, "password": string }`
- Sets a `sessiontoken` cookie on success.

### Profile (Protected)

- **GET** `/profile`
- Requires `sessiontoken` cookie.
- Returns user info (except password).

### Logout (Protected)

- **GET** `/logout`
- Clears the session cookie.

## User Model

- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `role`: String (`user` or `admin`)
- `isVerified`: Boolean
- `verificationToken`: String
- `resetPasswordToken`: String
- `resetPasswordExpires`: Date

## Notes

- Password reset endpoints are stubbed but not fully implemented.
- All responses are JSON.
- CORS is enabled for the `BASE_URL`.

## License

ISC
