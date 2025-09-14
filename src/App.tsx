import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import type { User } from './types';
import { authService } from './services/authService';
import Header from './components/header';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashBoardPage';
import ProdutosPage from './pages/ProdutosPage';
import UsuariosPage from './pages/UsuariosPage';
import MesasPage from './pages/MesasPage';
import CozinhaPage from './pages/CozinhaPage';
import ComandaPage from './pages/ComandaPage';
import CardapioPage from './pages/CardapioPage';

const AdminLayout: React.FC<{ user: User; onLogout: () => void; children: React.ReactNode }> = ({ user, onLogout, children }) => (
    <div className="flex h-screen bg-gray-100 font-sans">
        <Sidebar user={user} navigate={() => {}} /> {/* A navegação agora é gerida por Links */}
        <div className="flex-1 flex flex-col">
            <Header onLogout={onLogout} />
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
        const redirectTo = loggedInUser.role === 'ADMIN' ? '/dashboard' : '/mesas';
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
            {/* Rota Pública: Cardápio do Cliente */}
            <Route path="/cardapio/:numeroMesa" element={<CardapioPage />} />

            {/* Rota Pública: Login */}
            <Route
                path="/login"
                element={
                    user ? <Navigate to={user.role === 'ADMIN' ? '/dashboard' : '/mesas'} /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
                }
            />

            {/* Rotas Privadas (requerem login) */}
            <Route
                path="/*"
                element={
                    user ? (
                        <AdminLayout user={user} onLogout={handleLogout}>
                            <Routes>
                                <Route path="/dashboard" element={<DashboardPage navigate={() => {}} />} />
                                <Route path="/produtos" element={<ProdutosPage />} />
                                <Route path="/usuarios" element={<UsuariosPage />} />
                                <Route path="/mesas" element={<MesasPage navigate={() => {}} />} />
                                <Route path="/cozinha" element={<CozinhaPage />} />
                                {/* A rota da comanda precisa do ID como parâmetro */}
                                <Route path="/comanda/:comandaId" element={<ComandaPageWrapper />} />

                                {/* Redirecionamento padrão após o login */}
                                <Route path="/" element={<Navigate to={user.role === 'ADMIN' ? '/dashboard' : '/mesas'} />} />

                                {/* Rota para URLs não encontradas */}
                                <Route path="*" element={<div>Página não encontrada</div>} />
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

// Componente "Wrapper" para extrair o ID da URL e passá-lo para a ComandaPage
import { useParams } from 'react-router-dom';

const ComandaPageWrapper = () => {
    const { comandaId } = useParams<{ comandaId: string }>();
    if (!comandaId) return <div>ID da comanda inválido!</div>;
    return <ComandaPage comandaId={comandaId} />;
};