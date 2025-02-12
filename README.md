Business Card API

 📌 Introduction & Objectives
This project focuses on building a **REST API** for managing business card data. The primary goal is to develop a backend system that enables business users to create, manage, and publish business cards while maintaining authentication and authorization.

The **REST API** architecture ensures scalability and flexibility, making it a recommended solution for data-driven applications such as directories, catalogs, and other structured content platforms.

---

 📖 General Description
This API serves as the backend for a web application that allows business users to **register, authenticate**, and **manage business cards**. Business users can create, update, delete, and publish their business cards, while administrators can **oversee and manage** all users and their data.

---

 🛠️ Technologies Used
The project is built using the following technologies:

- **MongoDB** - NoSQL database to store user and business card data.
- **Express.js** - Backend framework for handling API routes.
- **Node.js** - JavaScript runtime environment.
- **bcryptjs** - Library for password hashing.
- **jsonwebtoken (JWT)** - Used for authentication and user session management.
- **dotenv** - Manages environment variables securely.
- **morgan** - Logger for tracking API requests.
- **cors** - Enables cross-origin resource sharing.
- **mongoose** - ODM for MongoDB, helping with schema validation.

---

 📦 Features
1. **Authentication & Authorization**
   - Uses **JWT (JSON Web Tokens)** for secure user authentication.
   - Supports **user roles** (Admin & Business User) with different access levels.

2. **Business Card Management**
   - Business users can **create, edit, delete, and publish** business cards.
   - Unique **bizNumber** assigned to each card.

3. **User Management**
   - Users can **register, login, update their profile**, and delete their accounts.
   - Admin users have full control over **all users and business cards**.

4. **Security**
   - Passwords are **hashed** using bcryptjs before storing them in the database.
   - API requests require **valid JWT tokens** for access.

5. **Logging & Monitoring**
   - All API requests are logged using **Morgan**.
   - API tracks request **timestamps, status codes, and response times**.

---

📌 Example API Endpoints

🔐 Authentication
POST /users/register - Register a new user.
POST /users/login - Authenticate and receive a JWT token.

📝 Business Cards
GET /cards - Get all business cards.
POST /cards - Create a new business card (Requires authentication).
PUT /cards/:id - Update a business card (Owner/Admin only).
DELETE /cards/:id - Delete a business card (Owner/Admin only).

🛠️ Admin Routes
GET /users - Get all users (Admin only).
DELETE /users/:id - Delete a user (Admin only).


Documentation:
Cards: https://documenter.getpostman.com/view/40123513/2sAYXBFehV
Users: https://documenter.getpostman.com/view/40123513/2sAYXBFehW


📜 License
This project is licensed under the MIT License.

