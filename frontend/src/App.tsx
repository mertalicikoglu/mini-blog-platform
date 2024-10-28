import { AuthProvider } from './auth/AuthProvider';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css'

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotasyonları burada tanımlayabilirsiniz */}
        </Routes>
      </Router>
    </AuthProvider>

  )
}

export default App
