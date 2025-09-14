import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import type { Pedido, StatusPedido } from '../types';

interface DashboardPageProps {
    navigate: (page: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ navigate }) => {
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div onClick={() => navigate('produtos')} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"><h2 className="text-xl font-semibold text-gray-700">Gerenciar Produtos</h2></div>
                <div onClick={() => navigate('usuarios')} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"><h2 className="text-xl font-semibold text-gray-700">Gerenciar Usuários</h2></div>
                <div onClick={() => navigate('mesas')} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"><h2 className="text-xl font-semibold text-gray-700">Visualizar Mesas</h2></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Status dos Pedidos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-lg shadow">
                    <p className="text-lg text-blue-800">Recebido</p>
                    <p className="text-3xl font-bold text-blue-900">{statusCounts.recebido || 0}</p>
                </div>
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg shadow">
                    <p className="text-lg text-yellow-800">Em Preparo</p>
                    <p className="text-3xl font-bold text-yellow-900">{statusCounts['Em Preparo'] || 0}</p>
                </div>
                <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-lg shadow">
                    <p className="text-lg text-green-800">Pronto</p>
                    <p className="text-3xl font-bold text-green-900">{statusCounts.pronto || 0}</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;