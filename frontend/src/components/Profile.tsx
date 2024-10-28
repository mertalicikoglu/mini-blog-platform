import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth'; // Kimlik doğrulama sağlayıcısı
import { supabase } from '../auth/supabaseClient';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  bio?: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users') // Tablo adı string olarak belirtiliyor.
          .select('*') // Verinin tüm alanlarını seçecek.
          .eq('id', user.id)
          .single(); // Tek bir kayıt döndürülmesini sağlar
  
        if (error) {
          console.error(error);
        } else {
          setProfile(data as UserProfile); // Tip zorlaması kullanarak `data`yı `UserProfile` olarak tanımlıyoruz.
          setBio(data?.bio || '');
        }
      }
    };
    fetchProfile();
  }, [user]);
  

  const handleSave = async () => {
    if (user) {
      const { error } = await supabase
        .from('users')
        .update({ bio })
        .eq('id', user.id);

      if (error) {
        console.error(error);
      } else {
        setProfile((prev) => (prev ? { ...prev, bio } : null));
        setEditMode(false);
      }
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Email: {profile.email}</p>
      <p>Username: {profile.username}</p>
      {editMode ? (
        <>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p>Bio: {profile.bio}</p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </>
      )}
    </div>
  );
};

export default Profile;
