import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="card animate-fade-in py-12">
        <h1 className="text-6xl font-bold text-primary-800 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-600 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="btn-primary inline-flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar para a página inicial
        </button>
      </div>
    </div>
  );
};

export default NotFound;