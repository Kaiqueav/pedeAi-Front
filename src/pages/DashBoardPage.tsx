import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import type { Pedido, StatusPedido } from '../types';
import { Link } from 'react-router-dom';


const DashboardPage: React.FC = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<Pedido[]>('/pedidos')
            .then(response => {
                setPedidos(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar pedidos:", error);
                setLoading(false);
            });
    }, []);

    const statusCounts = useMemo(() => {
        return pedidos.reduce((acc, pedido) => {
            const status = pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1);
            const key = status as StatusPedido;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {} as Record<StatusPedido, number>);
    }, [pedidos]);

    if (loading) return <p>A carregar dashboard...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            {/* Use o componente Link para navegar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link to="/produtos" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"><h2 className="text-xl font-semibold text-gray-700">Gerenciar Produtos</h2></Link>
                <Link to="/usuarios" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"><h2 className="text-xl font-semibold text-gray-700">Gerenciar Usuários</h2></Link>
                <Link to="/mesas" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"><h2 className="text-xl font-semibold text-gray-700">Visualizar Mesas</h2></Link>
            </div>
            {/* ... (resto do seu JSX) ... */}
        </div>
    );
};

export default DashboardPage;