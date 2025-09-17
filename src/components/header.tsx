import React, { useState } from 'react'; // <-- ESTA LINHA É A CORREÇÃO
import { Link } from 'react-router-dom';
import type { User } from '../types';

interface HeaderProps {
  onLogout: () => void;
  user: User;
}

// Ícones
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;


const Header: React.FC<HeaderProps> = ({ onLogout, user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center relative z-10">
      {/* Botão Hambúrguer - Visível apenas em ecrãs pequenos */}
      <div className="md:hidden">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-orange-600">
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div className="flex-grow flex justify-end">
        <button onClick={onLogout} className="text-gray-600 hover:text-orange-600 flex items-center">
          <span className="mr-2 hidden sm:inline">Sair</span> <LogoutIcon />
        </button>
      </div>
      
      {/* Menu Móvel - Aparece quando o estado isMobileMenuOpen é true */}
      {isMobileMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden z-20">
          <div className="flex flex-col p-4 space-y-2">
            {user.role === 'admin' && <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-3 rounded hover:bg-gray-100">Dashboard</Link>}
            {user.role === 'admin' && <Link to="/produtos" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-3 rounded hover:bg-gray-100">Produtos</Link>}
            {user.role === 'admin' && <Link to="/usuarios" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-3 rounded hover:bg-gray-100">Usuários</Link>}
            <Link to="/mesas" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-3 rounded hover:bg-gray-100">Mesas</Link>
            <Link to="/comandas" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-3 rounded hover:bg-gray-100">Comandas</Link>
            <Link to="/cozinha" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-3 rounded hover:bg-gray-100">Cozinha (KDS)</Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;