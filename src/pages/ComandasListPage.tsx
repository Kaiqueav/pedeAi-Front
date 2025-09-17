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
                const comandasAtivas = response.data.filter(c => c.status !== 'paga');
                setComandas(comandasAtivas);
            } catch (err) {
                setError("Não foi possível carregar a lista de comandas.");
            } finally {
                setLoading(false);
            }
        };
        fetchComandas();
    }, []);

    if (loading) return <p>A carregar comandas...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Comandas Ativas</h1>
            <div className="bg-white rounded-lg shadow-md">
                {comandas.length > 0 ? (
                    comandas.map(comanda => (
                        <div key={comanda.id} className="grid grid-cols-2 gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 items-center">
                            <div>
                                <div className="font-bold text-gray-800">Mesa {comanda.mesa?.numero || 'N/A'}</div>
                                <div className="font-mono text-sm text-gray-500">{comanda.id.substring(0, 8)}...</div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    comanda.status === 'aberta' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {comanda.status}
                                </span>
                                <Link to={`/comanda/${comanda.id}`} className="text-orange-600 hover:underline font-semibold mt-2">
                                    Ver Detalhes
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center text-gray-500">Nenhuma comanda ativa no momento.</div>
                )}
            </div>
        </div>
    );
};

export default ComandasListPage;