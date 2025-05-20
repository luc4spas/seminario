import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Search, Filter, Download, Calendar, Phone, User, Home } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

interface Registration {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  ministry: string[];
}

const Dashboard: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('');
  const { signOut, user } = useAuth();
  
  useEffect(() => {
    fetchRegistrations();
  }, []);
  
  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setRegistrations(data as Registration[]);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = registration.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         registration.phone.includes(searchTerm);
    const matchesFilter = filter ? registration.ministry.includes(filter) : true;
    
    return matchesSearch && matchesFilter;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  const exportToCSV = () => {
    const headers = ['Nome Completo', 'Telefone', 'Ministérios', 'Data de Cadastro'];
    const csvData = filteredRegistrations.map(reg => [
      reg.full_name,
      reg.phone,
      reg.ministry.join(', '),
      formatDate(reg.created_at)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `registros_ministerios_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary-800 mb-4 md:mb-0">
          Dashboard Administrativo
        </h1>
        
        <div className="flex items-center">
          <p className="mr-4 text-gray-600">
            <User className="inline-block mr-1 h-4 w-4" />
            {user?.email}
          </p>
          <button
            onClick={signOut}
            className="btn-outline flex items-center text-sm py-1.5"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Sair
          </button>
        </div>
      </div>
      
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou telefone..."
              className="input-field pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="md:w-64 relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field pl-10 appearance-none"
            >
              <option value="">Todos os ministérios</option>
              <option value="Boas Vindas">Boas Vindas</option>
              <option value="4 Estações">4 Estações</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          
          <button
            onClick={exportToCSV}
            className="btn-secondary flex items-center justify-center"
            disabled={filteredRegistrations.length === 0}
          >
            <Download className="h-5 w-5 mr-2" />
            Exportar CSV
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="py-20">
          <LoadingSpinner />
        </div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="card text-center py-16">
          <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-600 mb-2">Nenhum registro encontrado</h2>
          <p className="text-gray-500">
            {searchTerm || filter ? 'Tente ajustar seus filtros de busca' : 'Não há cadastros disponíveis ainda'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Nome Completo</th>
                <th className="py-3 px-4 text-left">Telefone</th>
                <th className="py-3 px-4 text-left">Ministérios</th>
                <th className="py-3 px-4 text-left">Data de Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRegistrations.map((registration) => (
                <tr 
                  key={registration.id} 
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    {registration.full_name}
                  </td>
                  <td className="py-3 px-4">
                    <a 
                      href={`tel:${registration.phone.replace(/\D/g, '')}`} 
                      className="flex items-center text-primary-600 hover:text-primary-800"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {registration.phone}
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {registration.ministry.map((ministry, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ministry === 'Boas Vindas'
                              ? 'bg-accent-100 text-accent-800'
                              : 'bg-secondary-100 text-secondary-800'
                          }`}
                        >
                          {ministry}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {formatDate(registration.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-4 text-sm text-gray-500">
            Mostrando {filteredRegistrations.length} de {registrations.length} registros
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;