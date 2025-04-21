# Todo App

A modern todo application built with Next.js and Supabase.

## Framework

This app is built using:
- Next.js 14 (App Router) - A React framework for building web applications
- TypeScript - For better code quality and type safety
- Tailwind CSS - For styling the user interface
- Supabase - For database and authentication

## Prerequisites

Before you begin, ensure you have:
- Node.js 18.17 or later installed

## How to Run the App

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. Install the required packages:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Structure

The app uses Supabase with these tables:

1. `todos` table:
   - `id` - Unique identifier for each todo
   - `title` - The name of the todo task
   - `description` - More details about the task
   - `status` - Shows if the task is "In Progress" or "Done"
   - `created_at` - When the task was created
   - `updated_at` - When the task was last modified
   - `user_id` - Links the task to the user who created it

2. Authentication tables (managed by Supabase):
   - `auth.users` - Stores user accounts
   - `auth.identities` - Stores login methods
   - `auth.sessions` - Manages user sessions

## How the App Works

### User Authentication
- Users can create an account with their email and password
- Users can log in with their email and password
- If users forget their password, they can reset it
- The app keeps users logged in until they choose to log out
- Users are automatically redirected to login when accessing protected routes

### Todo Management
1. Creating a Todo:
   - Click the "Add Task" button
   - Enter a title (required)
   - Add a description (optional)
   - Click "Add Task" to save

2. Viewing Todos:
   - Todos can be viewed in two ways:
     - Card View: Shows todos as cards with more details
     - List View: Shows todos in a simple list format
   - Each todo shows:
     - Title
     - Description (if added)
     - Status (In Progress or Done)
     - Options to edit or delete

3. Managing Todos:
   - Mark as Complete: Click the checkbox to change status
   - Edit: Click the pencil icon to change title, description, or status
   - Delete: Click the trash icon to remove a todo

4. Features:
   - Real-time updates when changes are made
   - Toast notifications for all actions
   - Loading states while actions are processing
   - Error handling with user-friendly messages
   - Responsive design that works on all devices

### Security
- All user data is protected
- Passwords are securely stored
- Users can only see and edit their own todos
- Secure authentication using Supabase
- Row Level Security ensures data privacy

## Features

- User Authentication:
  - Sign up with email and password
  - Log in with email and password
  - Password reset functionality
  - Secure session management
  - Protected routes

- Todo Management:
  - Create, read, update, and delete todos
  - Mark todos as complete or in progress
  - Add descriptions to todos
  - View todos in card or list format
  - Real-time updates

- User Interface:
  - Clean and modern design
  - Easy to use
  - Works on all devices
  - Loading states and error messages
  - Toast notifications for actions
