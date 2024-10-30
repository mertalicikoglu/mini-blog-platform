import React, { useEffect, useState } from 'react';
import { supabase } from '../auth/supabaseClient';

interface Notification {
  message: string;
  timestamp: string;
}

const UserNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // create a channel to listen for changes in the posts table
    const postChannel = supabase
      .channel('posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        setNotifications((prev) => [
          ...prev,
          {
            message: `New post added: ${payload.new.title}`,
            timestamp: new Date().toLocaleString(),
          },
        ]);
      })
      .subscribe();

    // create a channel to listen for changes in the comments table
    const commentChannel = supabase
      .channel('comments')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, (payload) => {
        setNotifications((prev) => [
          ...prev,
          {
            message: `New comment added: ${payload.new.content}`,
            timestamp: new Date().toLocaleString(),
          },
        ]);
      })
      .subscribe();

    // cleanup channels on unmount
    return () => {
      supabase.removeChannel(postChannel);
      supabase.removeChannel(commentChannel);
    };
  }, []);

  return (
    <div>
      <h3>Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>
              {notification.message} - {notification.timestamp}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserNotifications;
