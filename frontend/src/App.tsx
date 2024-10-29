import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import CreatePost from './components/CreatePost';
import Posts from './components/Posts';
import PostDetail from './components/PostDetail';
import ProtectedRoute from './auth/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/create-post" element={<ProtectedRoute element={<CreatePost />} path="/create-post" />} />
          <Route path="/post/:postId" element={<PostDetail />} /> {/* PostDetail rotası tanımlandı */}
          <Route path="/" element={<Posts />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
