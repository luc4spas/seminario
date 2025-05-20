import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <a href="/" className="flex items-center space-x-3 text-primary-800 hover:text-primary-700 transition-colors">
            <img src="/logo.png" alt="Semeando Família" className="h-10 w-10" />
            <span className="text-xl font-bold">Semeando Família</span>
          </a>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto py-8 px-4">
        <Routes>
          <Route path="/" element={<RegistrationForm />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {/* Footer */}
      <footer className="bg-primary-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Semeando Família. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App