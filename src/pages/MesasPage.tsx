import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Mesa, Comanda, StatusComanda } from '../types';
import { Link } from 'react-router-dom';

const MesasPage: React.FC = () => {
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [comandas, setComandas] = useState<Comanda[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para o formulário de criação
    const [numeroNovaMesa, setNumeroNovaMesa] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [creationError, setCreationError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [mesasResponse, comandasResponse] = await Promise.all([
                api.get<Mesa[]>('/mesa'),
                api.get<Comanda[]>('/comanda')
            ]);
            setMesas(mesasResponse.data.sort((a, b) => a.numero - b.numero));
            setComandas(comandasResponse.data);
            setError(null);
        } catch (err) {
            console.error("Erro ao buscar dados:", err);
            setError("Não foi possível carregar os dados das mesas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateMesa = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setCreationError(null);

        const numero = parseInt(numeroNovaMesa, 10);
        if (isNaN(numero) || numero <= 0) {
            setCreationError("Por favor, insira um número de mesa válido.");
            setIsSubmitting(false);
            return;
        }

        try {
            await api.post('/mesa', { numero });
            setNumeroNovaMesa('');
            await fetchData();
        } catch (err: any) {
            console.error("Erro ao criar mesa:", err);
            if (err.response?.data?.message) {
                setCreationError(`Erro: ${err.response.data.message}`);
            } else {
                setCreationError("Ocorreu um erro ao criar a mesa. Tente novamente.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusMesa = (mesaId: number): StatusComanda | 'livre' => {
        // --- CORREÇÃO AQUI ---
        // Adicionamos a verificação `c.mesa &&` para garantir que a propriedade existe
        const comandaAtiva = comandas.find(c => c.mesa && c.mesa.id === mesaId && c.status !== 'paga');
        return comandaAtiva ? comandaAtiva.status : 'livre';
    };

    const statusColors: Record<StatusComanda | 'livre', string> = {
        livre: 'bg-green-500 hover:bg-green-600',
        aberta: 'bg-orange-500 hover:bg-orange-600',
        fechada: 'bg-red-500 hover:bg-red-600',
        paga: 'bg-gray-400',
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestão de Mesas</h1>
            <div className="bg-white p-4 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Adicionar Nova Mesa</h2>
                <form onSubmit={handleCreateMesa} className="flex items-center space-x-4">
                    <div className="flex-grow">
                        <label htmlFor="numeroMesa" className="sr-only">Número da Mesa</label>
                        <input
                            id="numeroMesa"
                            type="number"
                            value={numeroNovaMesa}
                            onChange={(e) => setNumeroNovaMesa(e.target.value)}
                            placeholder="Número da nova mesa"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'A criar...' : 'Criar'}
                    </button>
                </form>
                {creationError && <p className="text-red-500 mt-2">{creationError}</p>}
            </div>
            {loading ? (
                <p>A carregar mesas...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {mesas.map(mesa => {
                        const status = getStatusMesa(mesa.id);
                        // Adicionamos a mesma verificação aqui por segurança
                        const comanda = comandas.find(c => c.mesa && c.mesa.id === mesa.id && c.status !== 'paga');
                        
                        const linkTo = comanda ? `/comanda/${comanda.id}` : '#';
                        const isClickable = status !== 'livre';

                        return (
                            <Link 
                                to={linkTo} 
                                key={mesa.id}
                                className={`p-4 rounded-lg text-white text-center shadow-lg transform transition-transform 
                                            ${statusColors[status]} 
                                            ${isClickable ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'}`}
                                onClick={(e) => !isClickable && e.preventDefault()}
                            >
                                <p className="text-4xl font-bold">{mesa.numero}</p>
                                <p className="capitalize">{status}</p>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MesasPage;