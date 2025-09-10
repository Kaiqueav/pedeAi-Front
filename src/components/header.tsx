import React from 'react';

const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

const Header: React.FC<{ onLogout: () => void }> = ({ onLogout }) => (
    <header className="bg-white shadow-md p-4 flex justify-end">
        <button onClick={onLogout} className="text-gray-600 hover:text-orange-600 flex items-center">
            <span className="mr-2">Sair</span> <LogoutIcon />
        </button>
    </header>
);

export default Header;