
import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor, introduce un email');
      return;
    }
    onLogin(email);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl animate-fadeIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-black text-gray-900 mb-2">Acceso Equipo</h2>
        <p className="text-gray-500 text-sm mb-6">Introduce tu correo corporativo para gestionar la plataforma.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@inexsos.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors"
          >
            Entrar al Panel
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
