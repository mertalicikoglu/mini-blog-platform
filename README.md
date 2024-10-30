# General Project README

## Overview

This project consists of a Mini Blog Platform, divided into two main parts: a frontend and a backend. The platform allows users to create, read, update, and delete blog posts and comments. The frontend is built with React using Vite, while the backend is powered by Node.js and Express.

## Live URL and Usage Information
URL: https://mini-blog-platform-mu.vercel.app/

To sign in as an admin, use the following credentials:

User: alicikoglumert@gmail.com
Password: 12345678
Only the admin user can create posts. If you sign in with your own account, you will only be able to post comments.



### Features

- **User Authentication:** Users can sign up and sign in using email and password.
- **CRUD Operations:** Create, Read, Update, and Delete (CRUD) operations are available for both blog posts and comments.
- **Real-Time Comments:** The platform supports real-time updates for comments.
- **Search Functionality:** Users can search for blog posts by title.
- **Responsive Design:** The frontend is fully responsive, providing a seamless experience across all devices.

## Project Structure

### Frontend
- **Tech Stack:** React, TypeScript, React Query, Bootstrap
- **Build Tool:** Vite
- **State Management:** React Query for server state
- **Styling:** Bootstrap for responsiveness and UI components

### Backend
- **Tech Stack:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL)
- **ORM:** Supabase's built-in ORM for easier data management
- **Validation:** Zod is used for request validation and error handling

## Installation and Setup

1. **Clone the Repository:**
   ```sh
   git clone https://github.com/mertalicikoglu/mini-blog-platform.git
   ```

2. **Navigate into the Project Directory:**
   ```sh
   cd mini-blog-platform
   ```

3. **Install Dependencies:**
   For both frontend and backend, navigate into each directory (`/frontend` and `/backend`) and run:
   ```sh
   npm install
   ```

4. **Environment Variables:**
   Create a `.env` file in both the `/frontend` and `/backend` directories and set the necessary environment variables. Examples include:
   - **Backend:** SUPABASE_URL, SUPABASE_KEY
   - **Frontend:** VITE_BACKEND_URL

5. **Run the Application:**
   To start both the backend and frontend servers, use the following commands:
   - **Backend:**
     ```sh
     npm run dev
     ```
   - **Frontend:**
     ```sh
     npm run dev
     ```

6. **Access the Application:**
   Open your web browser and go to `http://localhost:3000` to view the frontend.

## Deployment

- **Frontend:** Can be deployed using services like Vercel, Netlify, or similar platforms.
- **Backend:** Suitable for deployment on cloud platforms such as Heroku or Railway.

## Contributions

Feel free to contribute to this project by opening issues or submitting pull requests. Any improvements or new features are welcome.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any inquiries, please contact the project maintainer at alicikoglumert@gmail.com.

