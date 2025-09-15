import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { User } from '../types';

interface SidebarProps {
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? 'block py-2 px-3 rounded bg-gray-700 cursor-pointer'
      : 'block py-2 px-3 rounded hover:bg-gray-700 cursor-pointer';
  };

  return (
    <aside className="w-64 bg-gray-800 text-white flex-col hidden md:flex">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">PedeAí</div>
      <nav className="flex-grow p-4 space-y-2">
       
        {user.role === 'admin' && (
          <Link to="/dashboard" className={getLinkClass('/dashboard')}>
            Dashboard
          </Link>
        )}
        {user.role === 'admin' && (
          <Link to="/produtos" className={getLinkClass('/produtos')}>
            Produtos
          </Link>
        )}
        {user.role === 'admin' && (
          <Link to="/usuarios" className={getLinkClass('/usuarios')}>
            Usuários
          </Link>
        )}
        <Link to="/mesas" className={getLinkClass('/mesas')}>
          Mesas
        </Link>
      
        <Link to="/comandas" className={getLinkClass('/comandas')}>
        Comandas
        </Link>
        <Link to="/cozinha" className={getLinkClass('/cozinha')}>
          Cozinha (KDS)
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <p>{user.nome}</p>
        <p className="text-sm text-gray-400 capitalize">{user.role}</p>
      </div>
    </aside>
  );
};

export default Sidebar;