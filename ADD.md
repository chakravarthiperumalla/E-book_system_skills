# Architecture Design Document (ADD)

## 1. System Overview
The Ecommerce Web application is a modern, full-stack web platform built to handle user authentication, product management, and shopping cart flows.

## 2. Architecture Style (Monolith/Microservices)
**Monolith (Client-Server Model):** Given the requirement to avoid Docker and deploy easily on Render, a monolithic architecture with a clearly separated frontend SPA and backend REST API is the most pragmatic and maintainable approach. Both can be hosted inside one repository to streamline deployment.

## 3. Technology Stack (with justification)
- **Frontend:** React.js (Vite) - For building a dynamic, functional, and perfectly working UI quickly.
- **Backend:** FastAPI (Python) - High performance, easy to build REST APIs, and built-in data validation with Pydantic.
- **Database:** Postgres - Flexible schema design, suitable for varying product attributes.
- **Authentication:** JSON Web Tokens (JWT) & bcrypt for secure, stateless authentication.

## 4. Component Architecture
- **Client (Frontend App):** Handles UI rendering, state management, and communicates with the backend via REST endpoints.
- **API Server (Backend):** Routes requests, enforces authentication, and contains business logic (FastAPI routers and endpoint functions).
- **Database Layer:** Manages persistent data (Users, Products, Orders).

## 5. Data Flow Description
1. Client sends an HTTP request (e.g., `GET /api/products`).
2. FastAPI Router maps the request to the corresponding endpoint function.
3. The endpoint function interacts with the PostgreSQL Database via an ORM like SQLAlchemy.
4. Database returns data to the endpoint function.
5. FastAPI structures the response (JSON) using Pydantic models and sends it back to the Client.
6. Client updates the UI based on the response.

## 6. Database Design
- **Users Table:**
  - Fields: `id`, `name`, `email`, `password` (hashed), `isAdmin`, `createdAt`
  - Relationships: 1-to-many with Orders.
- **Products Table:**
  - Fields: `id`, `name`, `description`, `price`, `image`, `category`, `countInStock`, `createdAt`
  - Relationships: Many-to-many with Orders (via OrderItems table).
- **Orders Table:**
  - Fields: `id`, `userId` (ref: Users), `shippingAddress` (JSON or separate fields), `totalPrice`, `isPaid`, `isDelivered`
  - Relationships: Belongs to User, 1-to-many with OrderItems.
- **OrderItems Table (Junction):**
  - Fields: `id`, `orderId` (ref: Orders), `productId` (ref: Products), `qty`, `price`

## 7. API Design
- `POST /api/users/login` | Request: `{ email, password }` | Response: `{ id, name, email, token }`
- `POST /api/users/register` | Request: `{ name, email, password }` | Response: `{ id, name, email, token }`
- `GET /api/products` | Request: None | Response: `[ { product objects } ]`
- `GET /api/products/:id` | Request: None | Response: `{ product object }`
- `POST /api/orders` | Request: `{ orderItems, shippingAddress, totalPrice }` (Auth required) | Response: `{ order details }`

## 8. Security Considerations
- Passwords must be hashed using `bcrypt` before saving to DB.
- API endpoints modifying data must be protected with JWT.
- CORS must be configured to only allow requests from the designated frontend domain.
- Input validation to prevent SQL injection and XSS.

## 9. Scalability Strategy
- The application will be completely stateless on the backend (using JWTs), making it easy to scale horizontally on Render if needed.
- PostgreSQL managed database instances (Render or external) will handle database scaling.

## 10. Deployment Overview
- **Platform:** Render
- **Method:** We will build a single FastAPI server that serves static frontend files (React) from a `public/` directory and handles `/api/*` routes. This approach bypasses the need for multiple Render services or Docker containers.
- **Environment Variables:** Handled via Render's dashboard (`DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`, `PORT`).
- **No Docker containerization will be used**, aligning with direct platform requirements.

