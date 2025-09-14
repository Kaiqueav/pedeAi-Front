import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Mesa, Comanda, StatusComanda } from '../types';

interface MesasPageProps {
    navigate: (page: string, params?: any) => void;
}

const MesasPage: React.FC<MesasPageProps> = ({ navigate }) => {
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [comandas, setComandas] = useState<Comanda[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get<Mesa[]>('/mesa'),
            api.get<Comanda[]>('/comanda')
        ]).then(([mesasResponse, comandasResponse]) => {
            setMesas(mesasResponse.data);
            setComandas(comandasResponse.data);
        }).catch(err => {
            console.error("Erro ao buscar dados das mesas ou comandas:", err);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const getStatusMesa = (mesaId: number): StatusComanda | 'livre' => {
        const comanda = comandas.find(c => c.mesaId === mesaId && (c.status === 'aberta' || c.status === 'fechada'));
        return comanda ? comanda.status : 'livre';
    }

    const statusColors: Record<StatusComanda | 'livre', string> = {
        livre: 'bg-green-500',
        aberta: 'bg-orange-500',
        fechada: 'bg-red-500',
        paga: 'bg-gray-400' // Embora não seja um status primário da mesa, é bom ter aqui
    };

    if (loading) return <p>A carregar mesas...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Visualização de Mesas</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {mesas.map(mesa => {
                    const status = getStatusMesa(mesa.id);
                    const comanda = comandas.find(c => c.mesaId === mesa.id && c.status !== 'paga');
                    return (
                        <div
                            key={mesa.id}
                            onClick={() => comanda && navigate('comanda', { id: comanda.id })}
                            className={`p-4 rounded-lg text-white text-center shadow-lg transform hover:scale-105 transition-transform cursor-pointer ${statusColors[status]}`}
                        >
                            <p className="text-4xl font-bold">{mesa.numero}</p>
                            <p className="capitalize">{status}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MesasPage;