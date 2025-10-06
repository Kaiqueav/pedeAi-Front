import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Pedido, StatusPedido } from '../types';


const formatStatus = (status: StatusPedido) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const ColunaKanban: React.FC<{ titulo: StatusPedido, pedidos: Pedido[], onUpdate: () => void }> = ({ titulo, pedidos, onUpdate }) => {
    const updatePedidoStatus = async (id: string, status: StatusPedido) => {
        try {
            await api.patch(`/pedidos/${id}/status`, { status });
            onUpdate();
        } catch (error) {
            console.error(`Erro ao atualizar status do pedido ${id}:`, error);
            alert('Não foi possível atualizar o pedido.');
        }
    };

    return (
       <div className="bg-gray-100 rounded-lg p-3 w-full md:w-1/3 flex-shrink-0">
            <h2 className="text-xl font-bold mb-4 text-gray-700">{formatStatus(titulo)}</h2>
            <div className="space-y-4">
                {pedidos.map(pedido => (
                    <div key={pedido.id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-center">
                            <p className="font-bold">Pedido #{pedido.id.substring(0, 5)}</p>
             
                            <p className="text-sm text-gray-500">
                                Mesa {pedido.comanda?.mesa?.numero || 'N/A'}
                            </p>
                        </div>
                        <ul className="list-disc list-inside mt-2 text-sm">
                            {pedido.itensPedido?.map((item, index) => (
                                <li key={index}>
                                    {item.quantidade}x {item.produto.nome}
                                    {item.observacao && <em className="text-xs text-gray-500 block"> ({item.observacao})</em>}
                                </li>
                            )) || <li>Itens não carregados.</li>}
                        </ul>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {pedido.status === 'recebido' && (
                                <button onClick={() => updatePedidoStatus(pedido.id, 'em_preparo')} className="text-xs bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600">Mover p/ Preparo</button>
                            )}
                            {pedido.status !== 'pronto' && (
                                <button onClick={() => updatePedidoStatus(pedido.id, 'pronto')} className="text-xs bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">Marcar como Pronto</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CozinhaPage: React.FC = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPedidos = () => {
        api.get<Pedido[]>('/pedidos?relations=comanda,comanda.mesa,itensPedido,itensPedido.produto') // Garante que a mesa vem
            .then(response => {
                setPedidos(response.data.filter(p => p.status !== 'cancelado' && p.status !== 'paga'));
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPedidos();
        const interval = setInterval(fetchPedidos, 15000);
        return () => clearInterval(interval);
    }, []);

    if (loading && pedidos.length === 0) return <p>A carregar pedidos da cozinha...</p>;

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Acompanhamento de Pedidos (KDS)</h1>
          
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <ColunaKanban titulo="recebido" pedidos={pedidos.filter(p => p.status === 'recebido')} onUpdate={fetchPedidos} />
                <ColunaKanban titulo="em_preparo" pedidos={pedidos.filter(p => p.status === 'em_preparo')} onUpdate={fetchPedidos} />
                <ColunaKanban titulo="pronto" pedidos={pedidos.filter(p => p.status === 'pronto')} onUpdate={fetchPedidos} />
            </div>
        </div>
    );
};

export default CozinhaPage;