# 🛍️ ShopKart

### A Full-Stack MERN E-Commerce Application

Browse products, discover items, manage your wishlist and cart, and
explore a complete online-shopping workflow.

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/API-Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**Repository:**
[github.com/shambhavishareshtha/shopKart](https://github.com/shambhavishareshtha/shopKart)
:::📌 Overview
ShopKart is a full-stack e-commerce web application built using the
MERN stack (MongoDB, Express.js, React, and Node.js). The project
connects a React frontend to a REST API backend and uses MongoDB for
persistent data storage.
The application is designed to support core shopping flows, including
customer accounts, product discovery, wishlist and cart management, and
order/payment-related functionality.
✨ Features
- Customer authentication --- Register and log in to access
  account-related features.
- Product catalogue --- Browse available products and view
  individual product details.
- Search and category filtering --- Find products using search and
  category filters.
- Wishlist --- Save products to a personal wishlist.
- Shopping cart --- Add products to the cart and manage cart
  contents.
- Order and payment flow --- Backend order/payment functionality
  with Razorpay integration, where configured.
- MongoDB persistence --- Store and retrieve application data
  using Mongoose.
- REST API --- Separate backend routes and controllers for
  application resources.
Note: Payment functionality requires valid Razorpay test
credentials. Confirm the current repository implementation and
configuration before demonstrating each feature.

🧰 Tech Stack
  Area              Technology
  Frontend          React, JavaScript, Vite
  Routing           React Router (where configured)
  Backend           Node.js, Express.js
  Database          MongoDB, Mongoose
  API testing       Postman
  Payments          Razorpay (where configured)
  Version control   Git, GitHub
  
🗂️ Project Structure
The project is organized into separate frontend and backend
applications. A typical layout is:
shopKart/
├── frontend/          # React + Vite user interface
├── backend/           # Express API, models, controllers and routes
├── .gitignore
└── README.md
The exact file and folder names may differ slightly in the current
repository.

⚙️ Prerequisites
Before you begin, install:
- Node.js (LTS) and npm
- MongoDB Community
  Server or a
  MongoDB Atlas cluster
- Git
- Postman (optional, for API testing)

- 
🚀 Getting Started
1. Clone the repository
git clone https://github.com/shambhavishareshtha/shopKart.git
cd shopKart
2. Install and configure the backend
cd backend
npm install
Create a local file named .env inside the backend/ directory. Add
the environment variables required by your backend code. For example:
PORT=8085
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
Configuration notes
- MONGO_URI must point to your local MongoDB database or Atlas
  cluster.
- Match the variable names to the ones actually read by your backend;
  remove any variables your code does not use.
- Razorpay variables are needed only if you are testing payment
  functionality.
- Never commit this .env file or place server secrets in frontend
  code.
Start the backend using the script defined in backend/package.json. If
a development script is available, run:
npm run dev
The backend uses port 8085 by default unless overridden by
configuration. Check the terminal output for startup and
database-connection errors.
3. Install and start the frontend
Open a second terminal from the project root:
cd frontend
npm install
npm run dev
Open the local URL printed by Vite. The default is usually:
http://localhost:5173
Keep both the frontend and backend running while testing the
application.
If the frontend requires an API base URL environment variable, check the
API client/configuration file and create a local frontend/.env file
using the exact variable name expected by the code. In Vite, variables
prefixed with VITE_ are exposed to the browser, so never put secrets
in them.

🗄️ Database Setup
ShopKart uses MongoDB with Mongoose for database operations.
1. Start your local MongoDB service, or create a MongoDB Atlas cluster.
2. Set MONGO_URI in backend/.env.
3. For Atlas, configure database access and allow your development IP
   address in Network Access.
4. Start the backend and check its terminal for a successful database
   connection.
5. Register a test account and create or update data through the app,
   then confirm that the data persists in MongoDB.
The backend includes customer and product data models. Cart and wishlist
operations associate products with a customer account.

🔌 API Overview
The backend groups its REST API routes by resource:
  Route prefix                        Purpose
  /customers                        Customer/account operations
  /products                         Product creation, listing,
                                      retrieval, search and filtering
  /wishlist                         Wishlist operations
  /cart                             Shopping-cart operations
  /orders                           Order and payment-related
                                  operations, if enabled
For exact endpoint paths, request bodies, response formats, and
authentication requirements, refer to the backend route and controller
files. You can test the endpoints with Postman while the backend is
running.

🔐 Security Checklist
Before pushing changes to GitHub:
- [ ] .env files are excluded by .gitignore.
- [ ] No database passwords, API keys, JWT secrets, or payment secrets
  are committed.
- [ ] Only safe, public configuration values are exposed to the
  frontend.
- [ ] Any committed .env.example contains placeholders only.
- [ ] Credentials are stored locally and are not hard-coded in source
  files.
A root .gitignore should contain rules similar to:
node_modules/
.env
.env.*
!.env.example
dist/
coverage/
If a secret has already been pushed, revoke or rotate it
immediately. Deleting it in a new commit alone does not remove it from
Git history.
To check tracked files:
git status
git ls-files
If an environment file is already tracked, untrack it while keeping the
local copy:
git rm --cached backend/.env
Only run that command if the file exists at that path and is tracked by
Git.

✅ Testing Before Submission
- [ ] Latest frontend and backend code is pushed to GitHub.
- [ ] Frontend and backend dependencies install successfully.
- [ ] Backend starts without configuration errors.
- [ ] MongoDB connects and data persists.
- [ ] Registration and login work.
- [ ] Product listing, product details, search, and category filtering
  work.
- [ ] Wishlist and cart operations work for the logged-in user.
- [ ] Order/payment flow is tested with Razorpay test credentials, if
  included.
- [ ] No .env files, API keys, or secrets are tracked by Git.
- [ ] README.md is committed at the repository root.
      
👩‍💻 Author
Shambhavi Shareshtha
GitHub: @shambhavishareshtha
