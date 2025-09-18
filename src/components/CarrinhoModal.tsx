import React from 'react';
import type { ItemCarrinho } from '../types';

interface CarrinhoModalProps {
  itens: ItemCarrinho[];
  isOpen: boolean;
  onClose: () => void;
  onFinalizar: () => void;
  onUpdateQuantidade: (produtoId: string, novaQuantidade: number) => void;
  isSubmitting: boolean;
}

const CarrinhoModal: React.FC<CarrinhoModalProps> = ({ isOpen, itens, onClose, onFinalizar, onUpdateQuantidade, isSubmitting }) => {
  if (!isOpen) return null;

  const totalCarrinho = itens.reduce((total, item) => total + item.preco * item.quantidade, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Seu Pedido</h2>
        </div>

        <div className="p-6 flex-grow overflow-y-auto">
          {itens.length === 0 ? (
            <p className="text-gray-500">O seu carrinho está vazio.</p>
          ) : (
            <div className="space-y-4">
              {itens.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{item.nome}</p>
                    <p className="text-sm text-gray-600">
                      {item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button onClick={() => onUpdateQuantidade(item.id, item.quantidade - 1)} className="h-6 w-6 rounded-full bg-gray-200 text-gray-700">-</button>
                    <span>{item.quantidade}</span>
                    <button onClick={() => onUpdateQuantidade(item.id, item.quantidade + 1)} className="h-6 w-6 rounded-full bg-gray-200 text-gray-700">+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-bold text-green-600">
              {totalCarrinho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="flex justify-end space-x-4">
            <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300">
              Fechar
            </button>
            <button 
              onClick={onFinalizar} 
              disabled={isSubmitting || itens.length === 0}
              className="px-6 py-2 rounded-lg text-white bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300"
            >
              {isSubmitting ? 'A Enviar...' : 'Finalizar Pedido'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarrinhoModal;