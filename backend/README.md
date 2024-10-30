# Mini Blog Platform Backend

This is the backend service for the Mini Blog Platform. It is built using Node.js, Express.js, and Supabase (PostgreSQL).

## Prerequisites

- Node.js (version 18.19.1 preferred)
- npm
- Supabase account and project setup

## Setup Instructions

1. Clone the repository:

   ```sh
   git clone https://github.com/mertalicikoglu/mini-blog-platform.git
   cd mini-blog-platform
   cd backend
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory with the following environment variables:

   ```
   SUPABASE_URL=https://udjmycofjgenojgwxgud.supabase.co
   SUPABASE_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkam15Y29mamdlbm9qZ3d4Z3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxMTc0MDEsImV4cCI6MjA0NTY5MzQwMX0.icSZhihCKNIAUUYlAzPUS-3Wi3b_-2yS3WY-veCncaI
   PORT=3001
   ```


## Running the Server

1. Start the backend server:

   ```sh
   npm run dev
   ```

   The server will be running on `http://localhost:3001`.

## API Endpoints

### Posts

- `GET /api/posts` - Retrieve all posts with pagination and optional search.
- `GET /api/posts/:id` - Retrieve a single post by its ID.
- `POST /api/posts` - Create a new post. Requires authentication.
- `PUT /api/posts/:id` - Update an existing post. Requires authentication.
- `DELETE /api/posts/:id` - Delete a post. Requires authentication.

### Comments

- `GET /api/posts/:postId/comments` - Retrieve all comments for a specific post.
- `POST /api/posts/:postId/comments` - Add a new comment to a post. Requires authentication.
- `PUT /api/posts/:postId/comments/:commentId` - Update a comment. Requires authentication.
- `DELETE /api/posts/:postId/comments/:commentId` - Delete a comment. Requires authentication.

## Middleware

- `authMiddleware` - Handles user authentication via Supabase.
- `errorHandler` - Catches and formats errors returned from the server.

## Testing

Run the tests using Jest:

```sh
npm test
```

## License

This project is licensed under the MIT License.

