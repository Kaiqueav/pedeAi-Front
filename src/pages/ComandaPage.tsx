import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Comanda } from '../types';


interface ComandaComTotal extends Comanda {
    total: number;
}

interface ComandaPageProps {
  comandaId: string; 
}


const ComandaPage: React.FC<ComandaPageProps> = ({ comandaId }) => {
    const [comanda, setComanda] = useState<ComandaComTotal | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchComanda = () => {
        if (!comandaId) {
            setError("ID da comanda é inválido.");
            setLoading(false);
            return;
        }
        setLoading(true);
        api.get<ComandaComTotal>(`/comanda/${comandaId}`)
            .then(response => {
                setComanda(response.data);
                setError(null);
            })
            .catch(err => {
                console.error("Erro ao buscar comanda:", err);
                setError("Não foi possível carregar os dados da comanda.");
            })
            .finally(() => setLoading(false));
    };

  
    useEffect(() => {
        fetchComanda();
    }, [comandaId]);

   
    const fecharConta = async () => {
        if (!comanda) return;
        try {
            await api.patch(`/comanda/${comanda.id}`, { status: 'fechada' });
            fetchComanda(); 
        } catch (error) {
            console.error("Erro ao fechar a conta:", error);
            alert("Falha ao fechar a conta.");
        }
    };

    const marcarComoPaga = async () => {
         if (!comanda) return;
        try {
            await api.patch(`/comanda/${comanda.id}`, { status: 'paga' });
            fetchComanda();
        } catch (error) {
            console.error("Erro ao marcar como paga:", error);
            alert("Falha ao marcar como paga.");
        }
    }

    if (loading) return <p>A carregar dados da comanda...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!comanda) return <p>Comanda não encontrada.</p>;

    return (
        <div>
          
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Comanda - Mesa {comanda.mesa?.numero}</h1>
            <p className="mb-6 text-gray-600">Status: <span className="font-semibold capitalize">{comanda.status}</span></p>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold mb-4">Pedidos</h2>
                <div className="space-y-3">
                    {comanda.pedidos?.map(pedido => (
                        <div key={pedido.id} className="border-b pb-2">
                            <p className="font-semibold">Pedido #{pedido.id.substring(0, 5)}... - ({pedido.status.replace('_', ' ')})</p>
                            <ul>
                                {pedido.itensPedido?.map((item, i) =>
                                    <li key={i}>{item.quantidade}x {item.produto.nome}</li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center text-2xl font-bold mb-6">
                    <span>Total:</span>
                    <span>{comanda.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div className="flex space-x-4">
                    <button onClick={fecharConta} disabled={comanda.status !== 'aberta'} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 disabled:bg-gray-400">Fechar Conta</button>
                    <button onClick={marcarComoPaga} disabled={comanda.status !== 'fechada'} className="flex-1 bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-400">Marcar como Paga</button>
                </div>
            </div>
        </div>
    );
};

export default ComandaPage;