import { supabase } from './auth/supabaseClient';

export const initializeDatabase = async () => {
  try {
    // Posts tablosunu oluştur
    const createPostsTableQuery = `
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Comments tablosunu oluştur
    const createCommentsTableQuery = `
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // SQL sorgularını çalıştır
    const { error: postError } = await supabase.rpc('sql', { sql: createPostsTableQuery });
    if (postError) {
      throw new Error(`Error creating posts table: ${postError.message}`);
    }

    const { error: commentsError } = await supabase.rpc('sql', { sql: createCommentsTableQuery });
    if (commentsError) {
      throw new Error(`Error creating comments table: ${commentsError.message}`);
    }

    console.log('Tables initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};
