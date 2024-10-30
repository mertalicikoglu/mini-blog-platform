# Frontend README

## Project Overview

This is the frontend for the mini blog platform, developed using React and styled with Bootstrap for responsiveness and a modern user interface. The frontend interacts with the backend APIs to support CRUD operations for blog posts and comments.

## Tech Stack

- **React** (using Vite for project setup)
- **TypeScript** for type safety
- **React Query** for data fetching and caching
- **Bootstrap** for styling and responsive design
- **React Router** for navigation

## Installation

### Prerequisites

- Node.js (version 18.x recommended)
- npm or yarn

### Steps

1. Clone the repository:

   ```sh
   git clone https://github.com/your-repository/mini-blog-frontend.git
   cd frontend
   ```

2. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root of the project and add the following:

   ```sh
   VITE_BACKEND_URL=http://localhost:3001  # Replace with your backend URL if different
   ```

## Running the Application

To start the development server:

```sh
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:3000`.

## Project Structure

- **src/**: Contains all source code
  - **auth/**: Authentication-related logic
  - **components/**: React components like Posts, PostDetail, Comments, etc.
  - **utils/**: Utilities like form validation
  - **styles/**: Custom CSS for additional styling

## Features

- **User Authentication** (via Supabase Auth)
- **Create, Read, Update, Delete (CRUD) for Posts**
- **Commenting on Posts** with real-time updates
- **Responsive design** using Bootstrap
- **Form validation** with Zod

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Serves the production build locally.

## Environment Variables

- `VITE_BACKEND_URL`: URL of the backend API to interact with.

## API Integration

The frontend interacts with the backend APIs for CRUD operations on posts and comments. Make sure the backend is running at the specified `VITE_BACKEND_URL` for successful communication.

## Deployment

You can deploy this application on platforms like Vercel, Netlify, or any static site hosting service. Make sure to configure the `VITE_BACKEND_URL` appropriately for the production environment.

## Contribution

Feel free to fork the repository and submit pull requests. Make sure to follow best practices for code quality and add comments where necessary.

## License

This project is licensed under the MIT License.

