PathWallet: Your Personal AI-Powered Financial Assistant
Overview

PathWallet is a modern web application designed to help users manage their finances, track expenses, set financial goals, and receive personalized advice from an AI assistant. Built with a focus on user experience, security, and scalability, PathWallet leverages modern web technologies to provide a seamless and intuitive platform.

Features

User Authentication:
Secure user registration and login with password hashing and JWT (JSON Web Tokens) stored in HttpOnly cookies for enhanced security.

Dynamic Dashboard:
A central hub displaying a real-time overview of your finances, including monthly balance, total income, and total expenses.

Expense and Income Tracking:
Dedicated pages for adding, viewing, and managing all your income and expense records.

Financial Goals:
Set specific financial goals and track your progress with a dynamic progress bar, giving a clear path to achieving your financial objectives.

AI Financial Assistant:
An integrated AI assistant powered by the Gemini API that understands natural language queries.

Conversational Actions:
Add new income or expenses by simply typing a request, e.g., "Add 1500 GEL income from my salary."

Personalized Advice:
Receive tailored financial advice based on your real-time financial data.

Responsive Design:
Fully responsive and optimized for both desktop and mobile devices.

Technology Stack

Frontend:

Next.js: React framework for building fast, full-stack applications.

TypeScript: Enhances code quality and maintainability with static typing.

React: For building interactive user interfaces.

Zod: TypeScript-first schema validation for data integrity.

Tailwind CSS: Utility-first framework for rapid, responsive UI development.

shadcn/ui: Accessible, customizable UI components built with Tailwind CSS.

Backend:

Next.js API Routes: Secure API endpoints for backend logic.

Prisma: Modern ORM for type-safe database management.

PostgreSQL: Open-source relational database for financial and user data.

jsonwebtoken: Library for creating and verifying JWTs.

bcrypt: Library for hashing user passwords.

Google Generative AI (Gemini API): Powers the AI financial assistant.

Getting Started
Prerequisites

Node.js (v18 or higher)

npm (Node Package Manager)

PostgreSQL database

Docker (optional, recommended for database setup)

Installation

Clone the repository:

git clone https://pathwallet-repository-url
cd pathwallet


Install dependencies:

npm install


Set up environment variables:
Create a .env file in the root directory and add:

DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]"
JWT_SECRET_KEY="your_super_secret_key"
GEMINI_API_KEY="your_gemini_api_key"


Set up the database:
If using Docker, start a PostgreSQL container:

docker run --name pathwallet-postgres -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=pathwallet_db -p 5432:5432 -d postgres:latest


Apply database migrations with Prisma:

npx prisma migrate dev --name init


Run the application:

npm run dev


The app will be running at http://localhost:3000.
