# E-Book System Website ("E-Book Hub")
A complete, production-ready e-commerce platform for digital books. Built with a **React (Vite) Single Page Application** frontend and a **FastAPI (Python 3.10/3.11)** backend, integrated with **PostgreSQL (Neon DB)** and secure asset streaming.

---

## 📂 Project Structure

```
d:/Gnanam AI/TEN_PRO/E-Book system/
├── backend/
│   ├── app/
│   │   ├── config/
│   │   │   └── db.py              # PostgreSQL database engine & session maker
│   │   ├── models/
│   │   │   └── all_models.py      # SQLAlchemy models (User, Book, Order, etc.)
│   │   ├── schemas/
│   │   │   └── all_schemas.py     # Pydantic validation schemas
│   │   ├── routers/
│   │   │   ├── auth.py            # User registration & JWT session logic
│   │   │   ├── books.py           # Catalog search & Admin CRUD endpoints
│   │   │   ├── orders.py          # Checkout & simulated Stripe webhook confirmation
│   │   │   └── library.py         # Secure expiring download links & file streaming
│   │   ├── utils/
│   │   │   ├── auth_helper.py     # Hashing contexts and RBAC dependencies
│   │   │   └── s3_helper.py       # Expiring URL generation & local folders manager
│   │   └── main.py                # FastAPI entry point & CORS configuration
│   ├── tests/
│   │   └── test_api.py            # API router integration test suite
│   ├── seed.py                    # Seeding script for injecting mock books & user profiles
│   ├── requirements.txt           # Python dependency declarations (no versions)
│   └── .env                       # Local environment variables
│
├── frontend/
│   ├── src/
│   │   ├── assets/                # Tailwind styles, resets, and layout icons
│   │   ├── components/            # Reusable components (Navbar, Footer, BookCard)
│   │   ├── context/               # AuthContext.jsx, CartContext.jsx (Axios configurations)
│   │   ├── pages/                 # Home, Details, Cart, Checkout, Library, Admin, Login, Register
│   │   └── App.jsx                # Layout router routing & provider wraps
│   ├── index.html                 # DOM template with Outfit typography imports
│   ├── package.json               # Frontend dependencies (no versions)
│   ├── tailwind.config.js         # Styling compilers
│   ├── postcss.config.js          # Class prefixers
│   ├── vite.config.js             # Vite development server and API proxy configs
│   └── .env                       # Client environment configurations
│
└── README.md                      # Complete setup & deployment guides (This file)
```

---

## 🛠️ Step 1: Backend Setup (FastAPI)

Ensure you have **Python 3.10 or 3.11** installed.

1. **Navigate to the Backend directory:**
   ```bash
   cd backend
   ```

2. **Create and Activate a Virtual Environment:**
   ```bash
   # Windows:
   python -m venv venv
   .\venv\Scripts\activate

   # macOS/Linux:
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies:**
   *(Note: As per requirements, dependency versions are omitted from `requirements.txt` to fetch the latest stable packages).*
   ```bash
   pip install -r requirements.txt
   ```

4. **Set Up the `.env` Configuration File:**
   Create a `.env` file in the `backend/` folder (a pre-configured template is already generated for you). You can edit it to connect to your Postgres Neon Database:
   ```env
   # Database Connection (Neon Postgres connection string with sslmode=require)
   DATABASE_URL=postgresql://neondb_owner:password@ep-host-123456.us-east-2.aws.neon.tech/neondb?sslmode=require

   # Cryptographic secret for signing JSON Web Tokens (JWT)
   JWT_SECRET=super_secret_ebook_key_12345

   # Server configs
   PORT=8000
   HOST=127.0.0.1
   ```
   *Note: If no `DATABASE_URL` is configured, the system automatically falls back to a local SQLite database file (`ebook_system.db`) to ensure immediate out-of-the-box runnability.*

5. **Run the Database Seeder Script (Crucial):**
   This script will drop existing schemas, reconstruct tables, and insert dummy books (using Unsplash book cover URLs) along with ready-to-test Customer and Admin profiles:
   ```bash
   python seed.py
   ```

6. **Start the API Development Server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   The backend API documentation will be interactive and accessible at: `http://localhost:8000/docs`

---

## 💻 Step 2: Frontend Setup (React + Vite)

Ensure you have **Node.js** (v16+) installed.

1. **Navigate to the Frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install Package Dependencies:**
   *(Omitted versions in `package.json` ensure the package manager downloads latest stable builds).*
   ```bash
   npm install
   ```

3. **Set Up the `.env` Configuration File:**
   Ensure the `.env` file is present in your `frontend/` folder. It links Axios query mappings to the backend server:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Start the Frontend Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Step 3: Run Backend Tests

We have written API validation tests using `pytest` inside the `backend/` folder. To run the test client, execute:

1. Activate your virtual environment and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Run tests:
   ```bash
   pytest
   ```

---

## 🔑 Ready-to-Use Testing Accounts
The database seeder loads these preset credentials so you can log in and test directly:

### 1. Customer Account
- **Email:** `user@ebook.com`
- **Password:** `user123`
- **Permissions:** Browse catalog, add items to cart, buy via simulated Stripe elements, track download histories, and retrieve expiring links in "My Library".

### 2. Admin Account
- **Email:** `admin@ebook.com`
- **Password:** `admin123`
- **Permissions:** Access the private `/admin` dashboard routes, perform complete E-Book CRUD (creation, metadata editing, cover URL swaps, archiving), and audit order transaction charts/issue refunds.

---

## 🚀 Step 4: Production Deployment Guidelines (Render & Neon DB)

We have decoupled the front-end SPA and the backend API, allowing you to deploy easily on **Render** without Docker overhead.

### 1. Database Setup (PostgreSQL Neon DB)
1. Sign up at [Neon.tech](https://neon.tech/) and create a serverless PostgreSQL project.
2. Retrieve your connection string from the Neon dashboard. It will look like:
   `postgresql://neondb_owner:xyz123@ep-some-host.us-east-2.neon.tech/neondb?sslmode=require`
3. Enter this URI under `DATABASE_URL` inside your Render env settings (see below).

### 2. Backend Deployment on Render (Web Service)
1. Create a new **Web Service** on Render linked to your project repository.
2. Configure settings:
   - **Environment:** `Python`
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Add **Environment Variables** in Render settings:
   - `DATABASE_URL` = *(Your Neon DB connection string)*
   - `JWT_SECRET` = *(Any strong secure alphanumeric string)*
   - `PORT` = `8000`

### 3. Frontend Deployment on Render (Static Site)
1. Create a new **Static Site** on Render linked to your project repository.
2. Configure settings:
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
3. Add **Environment Variables** in Render settings:
   - `VITE_API_URL` = *(The public URL of your deployed Backend Web Service, e.g., `https://ebook-api.onrender.com`)*
