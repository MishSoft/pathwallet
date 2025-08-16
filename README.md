PathWallet: Your Personal AI-Powered Financial Assistant
Overview
PathWallet is a modern web application designed to help users manage their finances, track expenses, set financial goals, and receive personalized advice from an AI assistant. The project is built with a focus on user experience, security, and scalability, leveraging modern web technologies to provide a seamless and intuitive platform.

Features
User Authentication: Secure user registration and login with password hashing and JWT (JSON Web Tokens) stored in HttpOnly cookies for enhanced security.

Dynamic Dashboard: A central hub displaying a real-time overview of your finances, including monthly balance, total income, and total expenses.

Expense and Income Tracking: Dedicated pages for adding, viewing, and managing all your income and expense records.

Financial Goals: Set specific financial goals and track your progress with a dynamic progress bar, providing a clear path to your financial future.

AI Financial Assistant: An integrated AI assistant powered by the Gemini API that understands natural language queries.

Conversational Actions: Add new income and expenses simply by typing a request (e.g., "Add 1500 GEL income from my salary").

Personalized Advice: Receive personalized financial advice based on your real-time financial data.

Responsive Design: The application is fully responsive and optimized for both desktop and mobile devices.

Technology Stack
Frontend
Next.js: A React framework for building fast, full-stack applications.

TypeScript: A statically typed superset of JavaScript that enhances code quality and maintainability.

React: A JavaScript library for building user interfaces.

Zod: A TypeScript-first schema validation library for ensuring data integrity.

Tailwind CSS: A utility-first CSS framework for rapid and responsive UI development.

shadcn/ui: A collection of accessible and customizable UI components built with Tailwind CSS.

Backend
Next.js API Routes: Used to create secure API endpoints for all backend logic.

Prisma: A modern ORM (Object-Relational Mapper) for connecting to the database and managing data with a type-safe API.

PostgreSQL: A powerful, open-source relational database for storing financial and user data.

jsonwebtoken: A library for creating and verifying JWTs for secure authentication.

bcrypt: A library for hashing user passwords.

Google Generative AI: The Gemini API is used to power the AI financial assistant.

Getting Started
Follow these steps to set up the project on your local machine.

Prerequisites
Node.js (v18 or higher)

npm (Node Package Manager)

PostgreSQL database

Docker (optional, but recommended for setting up the database)

Installation
Clone the repository:

git clone https://pathwallet-repository-url
cd pathwallet

Install dependencies:

npm install

Set up environment variables:
Create a .env file in the root directory and add the following variables.

DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]"
JWT_SECRET_KEY="your_super_secret_key"
GEMINI_API_KEY="your_gemini_api_key"

Set up the database:
If you are using Docker, you can start a PostgreSQL container with this command:

docker run --name pathwallet-postgres -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=pathwallet_db -p 5432:5432 -d postgres:latest

Then, apply the database migrations with Prisma:

npx prisma migrate dev --name init

Run the application:

npm run dev

The application will be running at http://localhost:3000.
