import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import type { User } from './types';
import { authService } from './services/authService';
import Header from './components/header';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashBoardPage';
import ProdutosPage from './pages/ProdutosPage';
import UsuariosPage from './pages/UsuariosPage';
import MesasPage from './pages/MesasPage';
import CozinhaPage from './pages/CozinhaPage';
import ComandaPage from './pages/ComandaPage';
import CardapioPage from './pages/CardapioPage';
import ComandasListPage from './pages/ComandasListPage';

// Componente Wrapper para o Layout Principal
const AdminLayout: React.FC<{ user: User; onLogout: () => void; children: React.ReactNode }> = ({ user, onLogout, children }) => (
    <div className="flex h-screen bg-gray-100 font-sans">
        <Sidebar user={user} />
        <div className="flex-1 flex flex-col">
            <Header onLogout={onLogout} user={user} />
            <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
    </div>
);

export default function App() {
    const [user, setUser] = useState<User | null>(authService.getAuthenticatedUser());
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const handleLoginSuccess = (loggedInUser: User) => {
        setUser(loggedInUser);
        const redirectTo = loggedInUser.role === 'admin' ? '/dashboard' : '/mesas';
        navigate(redirectTo);
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        navigate('/login');
    };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">A carregar aplicação...</div>;
    }

    return (
        <Routes>
            <Route path="/cardapio/:numeroMesa" element={<CardapioPage />} />
            <Route
                path="/login"
                element={user ? <Navigate to={user.role === 'admin' ? '/dashboard' : '/mesas'} /> : <LoginPage onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
                path="/*"
                element={
                    user ? (
                        <AdminLayout user={user} onLogout={handleLogout}>
                            <Routes>
                                {/* Rotas de Admin */}
                                <Route path="/dashboard" element={<PrivateRoute roles={['admin']}><DashboardPage /></PrivateRoute>} />
                                <Route path="/produtos" element={<PrivateRoute roles={['admin']}><ProdutosPage /></PrivateRoute>} />
                                <Route path="/usuarios" element={<PrivateRoute roles={['admin']}><UsuariosPage /></PrivateRoute>} />

                                {/* Rotas Comuns */}
                                <Route path="/mesas" element={<MesasPage />} />
                                <Route path="/cozinha" element={<CozinhaPage />} />
                                <Route path="/comandas" element={<ComandasListPage />} />
                                <Route path="/comanda/:comandaId" element={<ComandaPageWrapper />} />

                                {/* Redirecionamento Padrão */}
                                <Route path="/" element={<Navigate to={user.role === 'admin' ? '/dashboard' : '/mesas'} />} />

                                {/* Rota 404 */}
                                <Route path="*" element={
                                    <div className='text-center'>
                                        <h2 className='text-2xl font-bold'>404 - Página Não Encontrada</h2>
                                        <Link to="/" className="text-orange-600 hover:underline mt-4 inline-block">Voltar ao início</Link>
                                    </div>
                                } />
                            </Routes>
                        </AdminLayout>
                    ) : (
                        <Navigate to="/login" state={{ from: location }} replace />
                    )
                }
            />
        </Routes>
    );
}

import { useParams } from 'react-router-dom';

const ComandaPageWrapper = () => {
    const { comandaId } = useParams<{ comandaId: string }>();
    if (!comandaId) return <div>ID da comanda inválido!</div>;
    return <ComandaPage comandaId={comandaId} />;
};