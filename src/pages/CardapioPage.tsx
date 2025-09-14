import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Produto, CategoriaProduto } from '../types';

// Opcional: Extrair o número da mesa da URL (requer React Router)
// import { useParams } from 'react-router-dom';

// Agrupa os produtos por categoria
const groupProductsByCategory = (products: Produto[]) => {
  return products.reduce((acc, product) => {
    const category = product.categoria;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<CategoriaProduto, Produto[]>);
};


const CardapioPage: React.FC = () => {
  // Com React Router, você pegaria o ID da mesa assim:
  // const { numeroMesa } = useParams<{ numeroMesa: string }>();
  const numeroMesa = 5; // Valor fixo para este exemplo

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get<Produto[]>('/produto');
        // Filtra apenas produtos disponíveis
        setProdutos(response.data.filter(p => p.disponivel));
      } catch (err) {
        setError('Não foi possível carregar o cardápio.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  const produtosAgrupados = groupProductsByCategory(produtos);
  const categoriasOrdenadas = Object.keys(produtosAgrupados).sort() as CategoriaProduto[];

  if (loading) {
    return <div className="text-center p-10">A carregar o nosso delicioso cardápio...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 font-sans">
      <header className="text-center my-8">
        <h1 className="text-5xl font-bold text-orange-600">PedeAí</h1>
        <p className="text-xl text-gray-600 mt-2">O nosso cardápio - Mesa {numeroMesa}</p>
      </header>

      <main>
        {categoriasOrdenadas.map((categoria) => (
          <section key={categoria} className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-orange-500 pb-2 mb-6 capitalize">
              {categoria}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {produtosAgrupados[categoria].map((produto) => (
                <div key={produto.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900">{produto.nome}</h3>
                    <p className="text-gray-600 mt-2">{produto.descricao}</p>
                  </div>
                  <div className="p-6 bg-gray-50 flex justify-between items-center">
                    <p className="text-lg font-bold text-green-600">
                      {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    {/* Futuramente, este botão adicionaria o item a um carrinho */}
                    <button className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                      Adicionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default CardapioPage;