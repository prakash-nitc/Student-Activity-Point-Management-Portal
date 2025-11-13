# Student Activity Point Management Portal - Complete Architecture Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Backend Architecture](#backend-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [Data Models](#data-models)
7. [Workflow & Request Lifecycle](#workflow--request-lifecycle)
8. [API Endpoints](#api-endpoints)
9. [Authentication & Authorization](#authentication--authorization)
10. [File Connections & Dependencies](#file-connections--dependencies)
11. [How It All Works Together](#how-it-all-works-together)

---

## Project Overview

The **Student Activity Point Management Portal** is a comprehensive system designed for **NITC (National Institute of Technology Calicut)** to manage student activity submissions and point allocations.

### Key Features:
- **Students** submit activity requests with proof documents (images/PDFs).
- **Faculty Advisors (FA)** review and approve/reject submissions.
- **Admins** manage categories, assign Faculty Advisors to students, and finalize approvals.
- **Role-Based Dashboard** for each user type with specific capabilities.
- **Point Cap System** (10 points max per category per student).
- **File Upload Management** with validation.
- **JWT-Based Authentication** for secure access.

---

## Tech Stack

### Backend
- **Framework:** Express.js (Node.js)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Password Security:** bcryptjs
- **File Upload:** multer
- **Email:** nodemailer
- **Error Handling:** express-async-handler

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **HTTP Client:** axios
- **Styling:** Tailwind CSS
- **Form Handling:** React hooks (useState, useEffect, useMemo)

### Development
- **Version Control:** Git
- **Package Manager:** npm

---

## Project Structure

```
Student-Activity-Point-Management-Portal/
│
├── server/                           # Backend (Express + MongoDB)
│   ├── server.js                     # Main entry point, app setup
│   ├── package.json                  # Server dependencies
│   │
│   ├── config/
│   │   └── db.js                     # MongoDB connection setup
│   │
│   ├── models/                       # Mongoose schemas
│   │   ├── userModel.js              # User schema (student, fa, admin)
│   │   ├── requestModel.js           # Activity request schema
│   │   └── categoryModel.js          # Activity category schema
│   │
│   ├── controllers/                  # Business logic
│   │   ├── authController.js         # Register & login logic
│   │   ├── requestController.js      # Request CRUD & status updates
│   │   ├── adminController.js        # Admin operations (FA assignment, categories)
│   │   ├── categoryController.js     # Category fetching
│   │   └── userController.js         # User profile retrieval
│   │
│   ├── routes/                       # API endpoints
│   │   ├── authRoutes.js             # /api/auth (register, login)
│   │   ├── requestRoutes.js          # /api/requests (CRUD)
│   │   ├── faRoutes.js               # /api/fa (FA review & approve)
│   │   ├── adminRoutes.js            # /api/admin (admin operations)
│   │   ├── categoryRoutes.js         # /api/categories
│   │   └── userRoutes.js             # /api/users
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT verification & role authorization
│   │   └── uploadMiddleware.js       # multer file upload config
│   │
│   ├── uploads/                      # Stored proof files
│   │   └── [proof files]
│   │
│   └── seeder/
│       └── seeder.js                 # (Optional) Database seeding
│
├── client/                           # Frontend (React + Vite)
│   ├── package.json                  # Client dependencies
│   ├── vite.config.js                # Vite build configuration
│   ├── tailwind.config.js            # Tailwind CSS config
│   ├── postcss.config.js             # PostCSS config
│   ├── index.html                    # HTML entry point
│   │
│   ├── src/
│   │   ├── main.jsx                  # React app mount point
│   │   ├── App.jsx                   # Main router & app layout
│   │   ├── App.css                   # Global styles
│   │   ├── index.css                 # Base styles + Tailwind
│   │   │
│   │   ├── services/
│   │   │   └── api.js                # Centralized axios API wrapper
│   │   │
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx          # Login page (hero UI with animations)
│   │   │   ├── RegisterPage.jsx      # Registration page
│   │   │   ├── LoginPage.jsx         # (Alternate login, may be deprecated)
│   │   │   └── DashboardPage.jsx     # Main dashboard router
│   │   │
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx         # (Alternate login, may be deprecated)
│   │   │   │   └── Register.jsx      # (Alternate register, may be deprecated)
│   │   │   │
│   │   │   ├── student/
│   │   │   │   ├── StudentDashboard.jsx    # Student stats & request list
│   │   │   │   └── RequestForm.jsx        # Form to submit activities
│   │   │   │
│   │   │   ├── fa/
│   │   │   │   ├── FADashboard.jsx        # FA review interface (now "Faculty Dashboard")
│   │   │   │   └── FADashboard.jsx.bak    # Backup of old FA dashboard
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx     # Admin main panel (tabs)
│   │   │       ├── CategoryManagement.jsx # Category CRUD UI
│   │   │       ├── AssignFARequests.jsx   # Assign FA to student UI
│   │   │       ├── FinalApprovalQueue.jsx # Final approval review UI
│   │   │       └── FinalizeRequests.jsx   # Finalize requests UI
│   │   │
│   │   └── assets/                   # Static images/icons
│   │
│   └── public/
│       └── images/                   # Public images (NITC logo, etc.)
│
└── README.md                         # Project documentation
```

---

## Backend Architecture

### 1. **server.js** - Application Entry Point

```javascript
// Loads environment variables from .env
// Connects to MongoDB via db.js
// Sets up Express middleware (CORS, JSON parser)
// Mounts all API routes
// Serves static uploads folder
// Starts server on PORT (default 5000)
```

**Key Setup:**
- `dotenv.config()` → Load env variables
- `connectDB()` → Initialize MongoDB connection
- `app.use(cors())` → Enable cross-origin requests
- `app.use(express.json())` → Parse JSON request bodies
- Route mounting at `/api/*` paths
- Static file serving: `/uploads` directory

---

### 2. **config/db.js** - Database Connection

Establishes MongoDB connection using Mongoose.

```javascript
mongoose.connect(process.env.MONGO_URI)
  // Throws error if connection fails
  // Logs connection host on success
```

**Environment Variable Required:**
- `MONGO_URI` — MongoDB connection string (e.g., `mongodb://localhost:27017/mydb` or Atlas URL)

---

### 3. **Models** - Data Schemas

#### **userModel.js**
Defines the User collection.

**Fields:**
- `name` (String, required)
- `email` (String, required, unique, @nitc.ac.in domain)
- `password` (String, hashed with bcrypt)
- `role` (Enum: 'student', 'fa', 'admin')
- `primary_fa_id` (Reference to another User — the student's assigned Faculty Advisor)
- `pointsData` (Array of `{ category, points }` — aggregated approved points)
- `passwordResetToken` & `passwordResetExpires` (For password reset, optional)
- `timestamps` (createdAt, updatedAt)

**Methods:**
- `matchPassword(enteredPassword)` — Compare entered password with hashed DB password (used in login)
- `createPasswordResetToken()` — Generate reset token (optional feature)

**Pre-save Hook:**
- Automatically hashes password if modified before saving

---

#### **requestModel.js**
Defines the Activity Request collection.

**Fields:**
- `studentId` (Reference to User, required)
- `title` (String, activity title)
- `category` (String, activity category name)
- `points` (Number, requested points)
- `status` (Enum: 'Submitted', 'FA Approved', 'Admin Finalized', 'Rejected', 'More Info Required')
- `proof` (String, file path to uploaded proof)
- `assignedFAId` (Reference to User — FA handling this request)
- `comments` (Array of `{ user, userName, role, text, date }` — audit trail)
- `timestamps` (createdAt, updatedAt)

**Status Workflow:**
1. `Submitted` — Initial state after student submission
2. `FA Approved` — FA approves it
3. `Admin Finalized` — Admin finalizes (points added to user.pointsData)
4. `Rejected` — Rejected by FA or Admin
5. `More Info Required` — FA sends back to student for more proof

---

#### **categoryModel.js**
Defines Activity Categories (e.g., "Sports", "Academics", "Community Service").

**Fields:**
- `name` (String, required, unique)
- `override_fa_id` (Optional reference to User — if set, this category always uses this FA instead of student's primary FA)

---

### 4. **Middleware**

#### **authMiddleware.js**
Two functions:

1. **`protect(req, res, next)`**
   - Extracts JWT token from `Authorization: Bearer <token>` header
   - Verifies token using `process.env.JWT_SECRET`
   - Sets `req.user` to decoded user document
   - Returns 401 error if token invalid/missing

2. **`authorize(...roles)`**
   - Higher-order function that returns middleware
   - Checks if `req.user.role` is in allowed roles
   - Returns 403 error if not authorized

**Usage Example:**
```javascript
router.post('/approve', protect, authorize('fa'), approveRequest);
// Only logged-in Faculty Advisors can access this
```

#### **uploadMiddleware.js**
Configures `multer` for file uploads.

**Settings:**
- Destination: `./uploads/` folder
- Filename format: `fieldname-timestamp.extension`
- Allowed types: JPEG, JPG, PNG, PDF
- Max file size: 10MB
- Error handling: Returns 400 if file type invalid

**Usage:**
```javascript
router.post('/request', protect, upload.single('proof'), createRequest);
// `upload.single('proof')` parses multipart/form-data
// File stored at `req.file.path`
```

---

### 5. **Controllers** - Business Logic

#### **authController.js**

**`registerUser(req, res)`**
- Validates email domain (`@nitc.ac.in`)
- Detects student email patterns (`_b\d` or `_m\d`) and restricts role to 'student'
- Checks if user already exists
- Creates new user (password auto-hashed by pre-save hook)
- Returns user data + JWT token

**`loginUser(req, res)`**
- Finds user by email
- Compares password using `matchPassword()` method
- On match, returns user data + JWT token
- On failure, returns 401

---

#### **requestController.js**

**`createRequest(req, res)`** (Student action)
- Validates proof file is attached
- Gets student data and category
- Determines `assignedFAId`:
  - If category has `override_fa_id`, use that
  - Else use student's `primary_fa_id`
  - Else reject (no FA assigned)
- Enforces 10-point cap per category (aggregates non-rejected requests for that student+category)
- Creates request with status `Submitted`
- Files uploaded via multer are saved to `./uploads/`

**`getMyRequests(req, res)`** (Student action)
- Returns all requests for logged-in student
- Populates FA name
- Sorted by creation date (newest first)

**`getRequestsForFA(req, res)`** (FA action)
- Returns all requests with status `Submitted` assigned to logged-in FA
- Populates student name/email
- Sorted by creation date

**`updateFAStatus(req, res)`** (FA action)
- Finds request
- Checks if logged-in FA is the assigned FA
- Updates status to: `FA Approved`, `Rejected`, or `More Info Required`
- Adds comment to comments array
- Returns updated request

**`bulkApproveRequests(req, res)`** (FA action)
- Bulk updates multiple requests to `FA Approved`
- Only for requests with status `Submitted` assigned to FA

**`finalizeAdminApproval(req, res)`** (Admin action)
- Finds request
- Verifies request status is `FA Approved`
- Updates status to `Admin Finalized` or `Rejected`
- If `Admin Finalized`:
  - Adds points to student's `pointsData` array
  - Enforces 10-point cap at finalization too
  - Saves student document
- Adds comment to comments array

**`resubmitRequest(req, res)`** (Student action)
- Only allows resubmission if status is `More Info Required`
- Accepts new proof file and optional new points
- Re-checks point caps
- Sets status back to `Submitted`
- Adds comment: "Student resubmitted with new proof"

---

#### **adminController.js**

**`getAllUsers(req, res)`** (Admin only)
- Returns all users (students and FAs) without passwords

**`assignPrimaryFA(req, res)`** (Admin only)
- Takes `studentId` and `faId` in request body
- Sets student's `primary_fa_id = faId`
- Saves and returns success message

**`createCategory(req, res)`** (Admin only)
- Creates new category
- Checks if category name already exists
- Takes optional `override_fa_id`

**`updateCategoryFA(req, res)`** (Admin only)
- Updates category's `override_fa_id`

**`getCategories(req, res)`** (Admin only)
- Returns all categories with FA info populated

**`getFinalApprovalQueue(req, res)`** (Admin only)
- Returns all requests with status `FA Approved` (waiting for admin finalization)
- Populated with student and FA info

---

#### **categoryController.js**

**`getAllCategories(req, res)`** (Any authenticated user)
- Returns all categories (used by students to populate dropdown)

---

#### **userController.js**

**`getUserProfile(req, res)`** (Any authenticated user)
- Returns logged-in user's profile (name, email, role, pointsData)
- Excludes password

---

### 6. **Routes** - API Endpoints

#### **authRoutes.js** - `/api/auth/*`
```
POST   /api/auth/register        → registerUser
POST   /api/auth/login           → loginUser
```

#### **requestRoutes.js** - `/api/requests/*`
```
POST   /api/requests              → createRequest (student, multipart file)
GET    /api/requests/myrequests   → getMyRequests (student)
PUT    /api/requests/:id/resubmit → resubmitRequest (student, multipart file)
PUT    /api/requests/:id/status   → finalizeAdminApproval (admin)
```

#### **faRoutes.js** - `/api/fa/*`
```
GET    /api/fa/requests                 → getRequestsForFA (fa)
PUT    /api/fa/requests/:id/status      → updateFAStatus (fa)
POST   /api/fa/requests/bulk-approve    → bulkApproveRequests (fa)
```

#### **adminRoutes.js** - `/api/admin/*`
```
GET    /api/admin/users                    → getAllUsers (admin)
PUT    /api/admin/users/assign-fa          → assignPrimaryFA (admin)
GET    /api/admin/categories               → getCategories (admin)
POST   /api/admin/categories               → createCategory (admin)
PUT    /api/admin/categories/:id           → updateCategoryFA (admin)
GET    /api/admin/requests/final-queue     → getFinalApprovalQueue (admin)
```

#### **categoryRoutes.js** - `/api/categories/*`
```
GET    /api/categories             → getAllCategories (any authenticated user)
```

#### **userRoutes.js** - `/api/users/*`
```
GET    /api/users/profile          → getUserProfile (any authenticated user)
```

---

## Frontend Architecture

### 1. **main.jsx** - React Entry Point
Mounts React app to DOM element with id `root`.

```javascript
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

### 2. **App.jsx** - Router & Layout

Defines all routes and guards:

**Route Structure:**
```
/                 → AuthPage (public, redirects to /dashboard if logged in)
/auth             → AuthPage (public login)
/register         → RegisterPage (public registration)
/login            → Redirects to /auth
/dashboard        → DashboardPage (private, guards with PrivateRoute)
```

**Guards:**
- `PrivateRoute` — Checks `localStorage.userInfo`; redirects to `/auth` if no token
- `PublicRoute` — If logged in, redirects to `/dashboard`

---

### 3. **services/api.js** - Centralized API Client

Uses `axios` with baseURL `http://localhost:5000/api`.

**Interceptor:**
- Automatically attaches JWT token from `localStorage.userInfo` to all requests
  ```javascript
  Authorization: Bearer <token>
  ```

**Exported Functions:**
```javascript
// Auth
login(formData) → POST /auth/login
register(formData) → POST /auth/register

// User Profile
getUserProfile() → GET /users/profile

// Categories
getAllCategories() → GET /categories

// Student requests
createRequest(requestData) → POST /requests (multipart)
getMyRequests() → GET /requests/myrequests
resubmitRequest(id, data) → PUT /requests/:id/resubmit (multipart)

// FA operations
getRequestsForFA() → GET /fa/requests
updateFAStatus(id, {status, comment}) → PUT /fa/requests/:id/status
bulkApproveRequests(requestIds) → POST /fa/requests/bulk-approve

// Admin operations
getFinalApprovalQueue() → GET /admin/requests/final-queue
finalizeAdminApproval(id, {status, comment}) → PUT /requests/:id/status
getAdminAllUsers() → GET /admin/users
assignPrimaryFA(studentId, faId) → PUT /admin/users/assign-fa
getAdminCategories() → GET /admin/categories
createAdminCategory(categoryData) → POST /admin/categories
updateAdminCategoryFA(categoryId, faId) → PUT /admin/categories/:id
```

---

### 4. **Pages**

#### **AuthPage.jsx** - Login
- Beautiful hero UI with animated gradients, doodles, and floating blobs
- Email & password form
- Shows error messages if login fails
- Links to `/register`
- On success, saves JWT to `localStorage.userInfo` and redirects to `/dashboard`

#### **RegisterPage.jsx** - Registration
- Similar hero UI as AuthPage
- Form: name, email, password, role dropdown
- Validates NITC domain (`@nitc.ac.in`)
- Auto-detects student emails (`_b\d`, `_m\d` patterns) and locks role to 'student'
- Links back to `/auth`
- On success, redirects to `/auth` to login

#### **DashboardPage.jsx** - Router for Dashboards
- Fetches user info from `localStorage`
- Displays header: "Welcome, {name}" + "{role} Dashboard" + Logout button
- Routes to appropriate dashboard based on role:
  - `role === 'student'` → `<StudentDashboard />`
  - `role === 'fa'` → `<FADashboard />` (now displays "Faculty Dashboard")
  - `role === 'admin'` → `<AdminDashboard />`

---

### 5. **Components**

#### **student/StudentDashboard.jsx**
- Fetches student's requests (`getMyRequests()`) and profile (`getUserProfile()`)
- Displays 3 stat cards:
  - Total Approved Points (max of pointsData aggregation or Admin Finalized requests sum)
  - Pending Requests count
  - Rejected Requests count
- Shows `<RequestForm />` to submit new activities
- Lists all student's requests in a table with status badges

#### **student/RequestForm.jsx**
- Form to submit new activity request
- Fields: title, category (dropdown), points, proof file (multipart)
- Calls `createRequest()` from api.js
- Shows success/error messages
- Resets form on successful submission
- Mentions 10-point per-category cap in UI

#### **fa/FADashboard.jsx** (Faculty Dashboard)
- Fetches pending requests assigned to FA (`getRequestsForFA()`)
- Shows stat cards:
  - Pending requests count
  - Selected requests count
  - Last refresh timestamp
- Displays requests in a table with:
  - Checkbox for bulk selection
  - Student name, title, category, points, submission date
  - Action buttons: View, Approve, Request Info, Reject
- "Approve Selected" button for bulk approval
- Modal for detailed request view and commenting
- Each action (Approve, Reject, Request Info) prompts for comment if required

#### **admin/AdminDashboard.jsx**
- Tabs: "Final Approvals" & "Categories"
- Renders `<FinalApprovalQueue />` or `<CategoryManagement />` based on active tab

#### **admin/FinalApprovalQueue.jsx** (FinalizeRequests.jsx)
- Fetches `getFinalApprovalQueue()` (FA Approved requests)
- Similar table to FA dashboard but for admin finalization
- Admin can finalize (approve) or reject each request
- On finalize, points added to student's `pointsData`

#### **admin/CategoryManagement.jsx**
- Fetches all categories (`getAdminCategories()`)
- Displays table of categories with current override FA
- Button to create new category
- Each category row has option to update override FA
- Uses dropdown to select FA from all available FAs

#### **admin/AssignFARequests.jsx**
- UI to assign primary FA to students
- Fetches all students and FAs
- Displays students in a list/table
- For each student, dropdown to select and assign primary FA

#### **auth/Login.jsx** & **auth/Register.jsx** (Deprecated)
- Alternate forms (not currently used, consider removing)

---

## Data Models

### User Document Example
```javascript
{
  _id: ObjectId,
  name: "Ankush Kumar",
  email: "ankush_b21043@nitc.ac.in",
  password: "$2a$10$...[hashed]...", // bcrypt hash
  role: "student",
  primary_fa_id: ObjectId("...fa_user_id..."),
  pointsData: [
    { category: "Sports", points: 8 },
    { category: "Academics", points: 5 }
  ],
  passwordResetToken: undefined,
  passwordResetExpires: undefined,
  createdAt: "2025-11-06T10:00:00Z",
  updatedAt: "2025-11-12T15:30:00Z"
}
```

### Request Document Example
```javascript
{
  _id: ObjectId,
  studentId: ObjectId("...student_user_id..."),
  title: "Participated in Coding Competition",
  category: "Academics",
  points: 5,
  status: "FA Approved",
  proof: "uploads/proof-1731360000000.pdf",
  assignedFAId: ObjectId("...fa_user_id..."),
  comments: [
    {
      user: ObjectId("...fa_user_id..."),
      userName: "Dr. Faculty",
      role: "fa",
      text: "Good submission. Approved.",
      date: "2025-11-10T12:00:00Z"
    }
  ],
  createdAt: "2025-11-08T09:00:00Z",
  updatedAt: "2025-11-10T12:00:00Z"
}
```

### Category Document Example
```javascript
{
  _id: ObjectId,
  name: "Sports",
  override_fa_id: ObjectId("...fa_user_id...") // Optional
}
```

---

## Workflow & Request Lifecycle

### Complete Flow (Step by Step)

#### **Phase 1: Setup (Admin)**
1. **Admin creates categories**
   - POST `/api/admin/categories` with `{ name: "Sports", override_fa_id: null }`
   - Categories stored in MongoDB

2. **Admin assigns Faculty Advisors**
   - **Option A:** Assign primary FA to student
     - PUT `/api/admin/users/assign-fa` with `{ studentId, faId }`
     - Sets student's `primary_fa_id`
   - **Option B:** Assign override FA to category
     - PUT `/api/admin/categories/:id` with `{ faId }`
     - Sets category's `override_fa_id`
   - When student submits request, system checks override first, then primary

---

#### **Phase 2: Student Submission**
1. **Student logs in**
   - POST `/api/auth/login` with email & password
   - Server returns JWT token
   - Client stores in `localStorage.userInfo`

2. **Student views request form**
   - Calls `getAllCategories()` to populate dropdown

3. **Student submits activity**
   - Fills form: title, category, points, uploads proof file
   - POST `/api/requests` with multipart form-data
   - `uploadMiddleware` validates and saves file to `./uploads/`
   - `createRequest` controller:
     - Finds category
     - Determines assigned FA (override or primary)
     - Checks if FA is assigned (error if not)
     - Validates points (positive number)
     - Aggregates existing requests to enforce 10-point cap
     - If `existing + new > 10` → rejects request
     - Creates Request document with status `Submitted`
   - Request now visible to assigned FA

---

#### **Phase 3: Faculty Advisor Review**
1. **FA logs in**
   - POST `/api/auth/login`

2. **FA views pending requests**
   - GET `/api/fa/requests` returns all requests with status `Submitted` assigned to FA
   - Displays in table

3. **FA takes action on each request**
   - **Option A: Approve**
     - PUT `/api/fa/requests/:id/status` with `{ status: "FA Approved" }`
     - Status updated, added to comments
     - Request now visible to Admin
   - **Option B: Reject**
     - PUT `/api/fa/requests/:id/status` with `{ status: "Rejected", comment: "..." }`
     - Requires comment, status updated
     - Request marked complete (no further action)
   - **Option C: Request More Info**
     - PUT `/api/fa/requests/:id/status` with `{ status: "More Info Required", comment: "..." }`
     - Requires comment
     - Student receives notification and can resubmit
   - **Option D: Bulk Approve**
     - POST `/api/fa/requests/bulk-approve` with `{ requestIds: [...] }`
     - Multiple selected requests updated to `FA Approved` at once

---

#### **Phase 4: Student Resubmission (if needed)**
1. **Student sees "More Info Required"**
   - In StudentDashboard, request shows status "More Info Required"

2. **Student resubmits**
   - PUT `/api/requests/:id/resubmit` with new proof file + optional new points
   - `resubmitRequest` controller:
     - Checks status is `More Info Required` (else rejects)
     - Validates new points
     - Re-aggregates existing requests to enforce cap (excluding this request)
     - Saves new proof file
     - Sets status back to `Submitted`
   - Request back in FA's queue

---

#### **Phase 5: Admin Finalization**
1. **Admin logs in**
   - POST `/api/auth/login`

2. **Admin views final approval queue**
   - GET `/api/admin/requests/final-queue` returns requests with status `FA Approved`

3. **Admin finalizes request**
   - PUT `/api/requests/:id/status` with `{ status: "Admin Finalized", comment: "..." }`
   - `finalizeAdminApproval` controller:
     - Checks status is `FA Approved` (else rejects)
     - If status `Admin Finalized`:
       - Finds student document
       - Checks if category entry exists in `pointsData`
       - If not, creates new entry: `{ category, points }`
       - If exists, adds points to existing (enforcing cap = 10)
       - Re-checks cap: if existing >= 10, error
       - If existing + new > 10, error
       - Saves student with updated `pointsData`
     - Status set to `Admin Finalized`
   - Request marked complete
   - Student's total points updated

4. **Alternative: Admin rejects**
   - PUT `/api/requests/:id/status` with `{ status: "Rejected" }`
   - No points added to student
   - Request marked complete

---

#### **Phase 6: Student Checks Results**
1. **Student views dashboard**
   - StudentDashboard fetches `getMyRequests()` and `getUserProfile()`
   - Displays:
     - Total Approved Points (from `pointsData`)
     - Pending requests (status Submitted, FA Approved, More Info Required)
     - Rejected requests
   - Can see all request statuses and comments

---

### Summary Timeline

| Phase | Actor | Status | Action |
|-------|-------|--------|--------|
| 0 | Admin | - | Create categories, assign FAs |
| 1 | Student | Submitted | Submit activity + proof |
| 2 | FA | Submitted | Review → Approve / Reject / Ask Info |
| 2b | Student | More Info Required | (Optional) Resubmit with new proof |
| 3 | Admin | FA Approved | Finalize (add points) or Reject |
| 4 | Student | Admin Finalized | Points reflected in profile |

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Body | Response | Role |
|--------|----------|------|----------|------|
| POST | `/register` | `{name, email, password, role}` | `{_id, name, email, role, token}` | Public |
| POST | `/login` | `{email, password}` | `{_id, name, email, role, token}` | Public |

### Requests (`/api/requests`)
| Method | Endpoint | Body | Response | Role |
|--------|----------|------|----------|------|
| POST | `/` | multipart: `{title, category, points, proof}` | `{request_doc}` | Student |
| GET | `/myrequests` | - | `[{request_docs}]` | Student |
| PUT | `/:id/resubmit` | multipart: `{points, proof}` | `{updated_request}` | Student |
| PUT | `/:id/status` | `{status, comment}` | `{updated_request}` | Admin |

### Faculty Advisor (`/api/fa`)
| Method | Endpoint | Body | Response | Role |
|--------|----------|------|----------|------|
| GET | `/requests` | - | `[{requests_submitted}]` | FA |
| PUT | `/requests/:id/status` | `{status, comment}` | `{updated_request}` | FA |
| POST | `/requests/bulk-approve` | `{requestIds: [...]}` | `{message}` | FA |

### Admin (`/api/admin`)
| Method | Endpoint | Body | Response | Role |
|--------|----------|------|----------|------|
| GET | `/users` | - | `[{users_no_password}]` | Admin |
| PUT | `/users/assign-fa` | `{studentId, faId}` | `{message}` | Admin |
| GET | `/categories` | - | `[{categories}]` | Admin |
| POST | `/categories` | `{name, override_fa_id}` | `{category_doc}` | Admin |
| PUT | `/categories/:id` | `{faId}` | `{updated_category}` | Admin |
| GET | `/requests/final-queue` | - | `[{fa_approved_requests}]` | Admin |

### Categories (`/api/categories`)
| Method | Endpoint | Body | Response | Role |
|--------|----------|------|----------|------|
| GET | `/` | - | `[{categories}]` | Authenticated |

### Users (`/api/users`)
| Method | Endpoint | Body | Response | Role |
|--------|----------|------|----------|------|
| GET | `/profile` | - | `{_id, name, email, role, pointsData}` | Authenticated |

---

## Authentication & Authorization

### JWT Flow

1. **User registers or logs in**
   - POST `/api/auth/register` or `/api/auth/login`
   - Server validates credentials
   - Server generates JWT: `jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })`
   - Returns token to client

2. **Client stores token**
   - Saved to `localStorage.userInfo` as JSON: `{ _id, name, email, role, token }`

3. **Client makes authenticated requests**
   - axios interceptor reads `localStorage.userInfo.token`
   - Adds header: `Authorization: Bearer <token>`

4. **Server verifies token**
   - `authMiddleware.protect()` middleware:
     - Extracts token from header
     - Calls `jwt.verify(token, process.env.JWT_SECRET)`
     - Sets `req.user` to decoded user document
     - Allows request to proceed
   - If token invalid/expired → 401 error

### Role-Based Authorization

After `protect()` middleware, `authorize(...roles)` middleware checks role:

```javascript
router.post('/admin-only', protect, authorize('admin'), adminAction);
// Only admins can access
```

Available roles:
- `'student'` — Can submit requests, view own requests, resubmit
- `'fa'` — Can review requests assigned to them, approve/reject/request info, bulk approve
- `'admin'` — Can manage categories, assign FAs, finalize requests

---

## File Connections & Dependencies

### Backend File Dependencies

```
server.js
├── dotenv (load .env)
├── express
├── cors
├── path
├── config/db.js ──────────→ mongoose, process.env.MONGO_URI
├── routes/authRoutes.js ──→ authController, authMiddleware
├── routes/requestRoutes.js ──→ requestController, authMiddleware, uploadMiddleware
├── routes/faRoutes.js ────→ requestController, authMiddleware
├── routes/adminRoutes.js ──→ adminController, authMiddleware
├── routes/categoryRoutes.js ──→ categoryController, authMiddleware
├── routes/userRoutes.js ──→ userController, authMiddleware

authController.js
├── User (userModel)
├── jwt (jsonwebtoken)
└── asyncHandler (express-async-handler)

requestController.js
├── asyncHandler
├── Request (requestModel)
├── User (userModel)
└── Category (categoryModel)

adminController.js
├── asyncHandler
├── Request, User, Category models

uploadMiddleware.js
├── multer
└── path

authMiddleware.js
├── jwt (jsonwebtoken)
├── asyncHandler
└── User (userModel)
```

### Frontend File Dependencies

```
main.jsx
└── React, ReactDOM, App

App.jsx
├── React, react-router-dom
├── AuthPage, RegisterPage, DashboardPage
├── App.css, index.css

DashboardPage.jsx
├── react-router-dom
├── StudentDashboard, FADashboard, AdminDashboard
├── services/api.js (getUserProfile)

StudentDashboard.jsx
├── useState, useEffect
├── services/api.js (getMyRequests, getUserProfile)
└── RequestForm.jsx

StudentDashboard.jsx
├── services/api.js (createRequest, getMyRequests, resubmitRequest)
└── RequestForm component

FADashboard.jsx
├── services/api.js (getRequestsForFA, updateFAStatus, bulkApproveRequests)

AdminDashboard.jsx
├── useState
├── CategoryManagement.jsx
└── FinalApprovalQueue.jsx

FinalApprovalQueue.jsx
├── services/api.js (getFinalApprovalQueue, finalizeAdminApproval)

CategoryManagement.jsx
├── services/api.js (getAdminCategories, updateAdminCategoryFA, createAdminCategory)

services/api.js
├── axios
└── localStorage (userInfo)
```

---

## How It All Works Together

### Complete Request Lifecycle (Technical View)

#### 1. Student submits activity

```
StudentDashboard / RequestForm component
  ↓
  User fills form & clicks "Submit"
  ↓
  createRequest(formData) in services/api.js
    → axios.post('/requests', formData, {headers: {'Content-Type': 'multipart/form-data'}})
  ↓
  Server: POST /api/requests
  ↓
  requestRoutes.js → protect middleware → authorize('student') middleware
  ↓
  uploadMiddleware (multer) processes file
    → Saves to ./uploads/proof-1731360000000.pdf
    → Sets req.file.path
  ↓
  requestController.createRequest(req, res)
    → Finds category by name
    → Gets student from req.user
    → Determines assignedFAId (override or primary)
    → Aggregates existing requests to check cap
    → Creates Request: { studentId, title, category, points, proof: req.file.path, assignedFAId, status: 'Submitted' }
    → Returns 201 + request document
  ↓
  Client stores response
  ↓
  StudentDashboard re-fetches getMyRequests()
    → Displays new request with status "Submitted"
```

#### 2. Faculty Advisor reviews

```
FADashboard component (Faculty)
  ↓
  Calls getRequestsForFA() on mount
    → GET /api/fa/requests
  ↓
  Server: GET /api/fa/requests
  ↓
  authMiddleware.protect() verifies JWT
  ↓
  faRoutes.js → authorize('fa')
  ↓
  requestController.getRequestsForFA(req, res)
    → Finds requests with status 'Submitted', assignedFAId: req.user.id
    → Populates studentId name, assignedFAId name
    → Returns sorted array
  ↓
  Client displays in table
  ↓
  FA clicks "Approve" button
  ↓
  updateFAStatus(id, {status: 'FA Approved', comment: ''})
    → axios.put(`/fa/requests/${id}/status`, {status, comment})
  ↓
  Server: PUT /api/fa/requests/:id/status
  ↓
  authMiddleware.protect() + authorize('fa')
  ↓
  requestController.updateFAStatus(req, res)
    → Finds request
    → Checks assignedFAId === req.user.id
    → Updates status = 'FA Approved'
    → Adds comment (if provided)
    → Saves and returns updated request
  ↓
  Client UI refreshes
```

#### 3. Admin finalizes

```
AdminDashboard → FinalApprovalQueue component (Admin)
  ↓
  Calls getFinalApprovalQueue() on mount
    → GET /api/admin/requests/final-queue
  ↓
  Server: GET /api/admin/requests/final-queue
  ↓
  authMiddleware.protect() + authorize('admin')
  ↓
  adminController.getFinalApprovalQueue(req, res)
    → Finds requests with status 'FA Approved'
    → Populates student/FA info
    → Returns array
  ↓
  Client displays requests ready for finalization
  ↓
  Admin clicks "Finalize" on request
  ↓
  finalizeAdminApproval(id, {status: 'Admin Finalized', comment: '...'})
    → axios.put(`/requests/${id}/status`, {status, comment})
  ↓
  Server: PUT /api/requests/:id/status
  ↓
  authMiddleware.protect() + authorize('admin')
  ↓
  requestController.finalizeAdminApproval(req, res)
    → Finds request
    → Checks status is 'FA Approved'
    → Sets status = 'Admin Finalized'
    → Finds student by request.studentId
    → Checks if category exists in student.pointsData
      → If not: creates new entry {category, points}
      → If exists: adds points (enforcing 10-point cap)
    → Saves updated student document
    → Returns updated request
  ↓
  Client updates UI
  ↓
  Student logs in and checks StudentDashboard
  ↓
  Calls getUserProfile()
    → GET /api/users/profile
  ↓
  userController.getUserProfile(req, res) returns student.pointsData
  ↓
  StudentDashboard calculates totalApprovedPoints from pointsData
  ↓
  UI displays updated total
```

---

## Environment Variables Required

Create a `.env` file in the `server/` directory:

```env
MONGO_URI=mongodb://localhost:27017/student_activity_db
JWT_SECRET=your_secret_key_here_make_it_long_and_random
PORT=5000
NODE_ENV=development

# Optional: for email notifications (if using nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

## Quick Setup & Run Instructions

### Server Setup
```bash
cd server
npm install
# Create .env with MONGO_URI and JWT_SECRET
npm start
# Server runs on http://localhost:5000
```

### Client Setup
```bash
cd client
npm install
npm run dev
# Dev server runs on http://localhost:5173 (Vite default)
# Client makes API calls to http://localhost:5000/api
```

### First Time Setup
1. Register test users (different roles)
2. Admin logs in → creates categories
3. Admin assigns primary FA to student
4. Student logs in → submits request
5. FA logs in → reviews and approves
6. Admin logs in → finalizes request
7. Student checks dashboard → sees points updated

---

## Summary

This is a complete MERN stack application for managing student activity points:

- **Backend (Express + MongoDB):** Handles authentication, request submission/review/approval workflow, file uploads, data validation, and role-based access control.
- **Frontend (React + Vite):** Provides role-specific dashboards (Student, Faculty, Admin) with intuitive UI for submitting and reviewing activity requests.
- **Data Flow:** Student submits → FA approves → Admin finalizes & awards points.
- **Security:** JWT-based authentication, role-based authorization, password hashing, file type validation.
- **Scalability:** Modular architecture with separated concerns (routes, controllers, models), making it easy to add features or modify logic.

All files are interconnected through a clear API contract and follow a RESTful design pattern. The project is fully functional for production use with proper error handling, validation, and UI/UX considerations.
