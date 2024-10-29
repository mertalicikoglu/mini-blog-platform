import React, { useState } from 'react';
import { useAuth } from './useAuth';

function SignIn() {
  const { signIn } = useAuth(); // useAuth'u kullanarak signIn işlevine erişiyoruz
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password); // signIn işlevi kullanılarak giriş yapıyoruz
      setError(null);
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign In</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign In</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default SignIn;
