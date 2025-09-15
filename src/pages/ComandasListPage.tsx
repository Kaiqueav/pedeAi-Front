import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Comanda } from '../types';

const ComandasListPage: React.FC = () => {
    const [comandas, setComandas] = useState<Comanda[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchComandas = async () => {
            try {
                const response = await api.get<Comanda[]>('/comanda');
                // Filtra para mostrar apenas comandas que não estão pagas
                const comandasAtivas = response.data.filter(c => c.status !== 'paga');
                setComandas(comandasAtivas);
            } catch (err) {
                console.error("Erro ao buscar comandas:", err);
                setError("Não foi possível carregar a lista de comandas.");
            } finally {
                setLoading(false);
            }
        };

        fetchComandas();
    }, []);

    if (loading) {
        return <p>A carregar comandas...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Comandas Ativas</h1>
            <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3">ID da Comanda</th>
                            <th className="p-3">Mesa</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comandas.length > 0 ? (
                            comandas.map(comanda => (
                                <tr key={comanda.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-mono text-sm">{comanda.id.substring(0, 8)}...</td>
                                    <td className="p-3">{comanda.mesa?.numero || 'N/A'}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            comanda.status === 'aberta' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {comanda.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <Link 
                                            to={`/comanda/${comanda.id}`} 
                                            className="text-orange-600 hover:underline font-semibold"
                                        >
                                            Ver Detalhes
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-3 text-center text-gray-500">Nenhuma comanda ativa no momento.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComandasListPage;