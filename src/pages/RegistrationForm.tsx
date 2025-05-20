import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { UserPlus, Phone, Users } from 'lucide-react';

interface FormData {
  fullName: string;
  phone: string;
  ministries: string[];
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  ministries?: string;
}

const MINISTRY_OPTIONS = [
  { id: 'boas-vindas', label: 'Boas Vindas' },
  { id: '4-estacoes', label: '4 Estações' }
];

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    ministries: [],
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Formato inválido. Use (99) 99999-9999';
    }
    
    if (formData.ministries.length === 0) {
      newErrors.ministries = 'Selecione pelo menos um ministério';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length <= 11) {
        if (formatted.length > 2) {
          formatted = `(${formatted.substring(0, 2)}) ${formatted.substring(2)}`;
        }
        if (formatted.length > 10) {
          formatted = `${formatted.substring(0, 10)}-${formatted.substring(10)}`;
        }
        setFormData({ ...formData, [name]: formatted });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleMinistryChange = (ministry: string) => {
    setFormData(prev => {
      const ministries = prev.ministries.includes(ministry)
        ? prev.ministries.filter(m => m !== ministry)
        : [...prev.ministries, ministry];
      
      return { ...prev, ministries };
    });
    
    if (errors.ministries) {
      setErrors({ ...errors, ministries: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.from('registrations').insert({
        full_name: formData.fullName,
        phone: formData.phone,
        ministry: formData.ministries,
      });
      
      if (error) throw error;
      
      setSubmitted(true);
      toast.success('Cadastro realizado com sucesso!');
      
      setFormData({
        fullName: '',
        phone: '',
        ministries: [],
      });
    } catch (error) {
      toast.error('Erro ao realizar cadastro. Por favor, tente novamente.');
      console.error('Error inserting data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card animate-fade-in">
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.png" alt="Semeando Família" className="h-16 w-16" />
        </div>
        
        <h1 className="text-center text-2xl md:text-3xl font-bold text-primary-800 mb-6">
          Cadastro para Ministérios
        </h1>
        
        {submitted ? (
          <div className="text-center py-8 animate-fade-in">
            <div className="bg-success-100 p-4 rounded-lg mb-6">
              <h2 className="text-success-700 text-xl mb-2">Cadastro Realizado!</h2>
              <p className="text-success-600">
                Seu cadastro foi recebido com sucesso. Em breve entraremos em contato.
              </p>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="btn-primary"
            >
              Novo Cadastro
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Nome Completo
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Digite seu nome completo"
                />
                <UserPlus className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.fullName && <p className="error-message">{errors.fullName}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Telefone
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="(99) 99999-9999"
                  maxLength={15}
                />
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>
            
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <Users className="h-5 w-5" />
                Ministérios de Interesse
              </label>
              <div className="space-y-2">
                {MINISTRY_OPTIONS.map(ministry => (
                  <label
                    key={ministry.id}
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.ministries.includes(ministry.label)}
                      onChange={() => handleMinistryChange(ministry.label)}
                      className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-3 font-medium text-gray-700">{ministry.label}</span>
                  </label>
                ))}
              </div>
              {errors.ministries && <p className="error-message">{errors.ministries}</p>}
            </div>
            
            <div className="mt-8">
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 mr-2 border-b-2 border-white rounded-full"></span>
                    Enviando...
                  </>
                ) : (
                  'Enviar Cadastro'
                )}
              </button>
            </div>
          </form>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Área administrativa?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium">
              Fazer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;