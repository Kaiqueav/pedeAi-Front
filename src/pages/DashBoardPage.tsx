import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import type { Pedido, StatusPedido } from '../types';
import { Link } from 'react-router-dom';

type StatusCounts = {
    [key in StatusPedido]?: number;
};

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
            acc[pedido.status] = (acc[pedido.status] || 0) + 1;
            return acc;
        }, {} as StatusCounts);
    }, [pedidos]);

    if (loading) return <p>A carregar dashboard...</p>;

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                <Link to="/produtos" className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-700">Gerenciar Produtos</h2>
                </Link>
                <Link to="/usuarios" className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-700">Gerenciar Usuários</h2>
                </Link>
                <Link to="/mesas" className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-700">Visualizar Mesas</h2>
                </Link>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Status dos Pedidos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-lg shadow">
                    <p className="text-md md:text-lg text-blue-800">Recebido</p>
                    <p className="text-2xl md:text-3xl font-bold text-blue-900">{statusCounts.recebido || 0}</p>
                </div>
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg shadow">
                    <p className="text-md md:text-lg text-yellow-800">Em Preparo</p>
                    <p className="text-2xl md:text-3xl font-bold text-yellow-900">{statusCounts.em_preparo || 0}</p>
                </div>
                <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-lg shadow">
                    <p className="text-md md:text-lg text-green-800">Pronto</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-900">{statusCounts.pronto || 0}</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;