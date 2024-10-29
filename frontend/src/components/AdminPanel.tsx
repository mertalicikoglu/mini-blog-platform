import React from 'react';
import { useAuth } from '../auth/useAuth';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      <p>Here you can manage posts and comments.</p>
      {/* Burada adminin gönderi ve yorum yönetimi yapabileceği diğer bileşenler yer alabilir */}
    </div>
  );
};

export default AdminPanel;
