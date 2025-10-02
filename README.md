# Pede Aí - Sistema de Gestão de Comandas

Pede Aí é uma aplicação frontend desenvolvida para gerenciar comandas, mesas, produtos e pedidos em um estabelecimento comercial, como um restaurante ou bar. A interface permite a interação de diferentes perfis de usuário, como administradores e garçons, cada um com suas respectivas permissões e funcionalidades.

## ✨ Funcionalidades Principais

- **Autenticação de Usuários:** Sistema de login seguro baseado em tokens para diferentes perfis (admin, garçom).
- **Dashboard (Admin):** Painel de controle para administradores com visão geral do sistema.
- **Gestão de Mesas (Garçom):** Visualização e gerenciamento das mesas do estabelecimento.
- **Gestão de Comandas:** Abertura, adição de itens e fechamento de comandas por mesa.
- **Cardápio Digital:** Visualização dos produtos disponíveis para adicionar às comandas.
- **Gestão de Produtos (Admin):** CRUD (Criação, Leitura, Atualização e Deleção) de produtos do cardápio.
- **Visão da Cozinha:** Tela para a cozinha visualizar os pedidos pendentes e marcar como prontos.
- **Gestão de Usuários (Admin):** CRUD de usuários do sistema.

## 🚀 Tecnologias Utilizadas

- **[React](https://react.dev/)**: Biblioteca para construção da interface de usuário.
- **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript que adiciona tipagem estática.
- **[Vite](https://vitejs.dev/)**: Ferramenta de build para um desenvolvimento frontend moderno e rápido.
- **[React Router DOM](https://reactrouter.com/)**: Para gerenciamento das rotas da aplicação.
- **[Axios](https://axios-http.com/)**: Cliente HTTP para realizar as chamadas à API backend.
- **[Material-UI (MUI)](https://mui.com/)**: Biblioteca de componentes React para um design rápido e consistente.

## ⚙️ Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:
- [Node.js](https://nodejs.org/en/) (versão 18.x ou superior)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

## 📦 Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/pedeai-front.git](https://github.com/seu-usuario/pedeai-front.git)
    ```

2.  **Acesse a pasta do projeto:**
    ```bash
    cd pedeai-front
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Configure as variáveis de ambiente:**
    - Crie um arquivo chamado `.env` na raiz do projeto.
    - Adicione a URL da sua API backend neste arquivo:
      ```
      VITE_API_BASE_URL=http://localhost:3000
      ```
    *Substitua `http://localhost:3000` pela URL correta da sua API.*

5.  **Execute a aplicação em modo de desenvolvimento:**
    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:5173`.

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a versão de produção da aplicação na pasta `dist/`.
- `npm run lint`: Executa o linter para analisar o código em busca de erros.
- `npm run preview`: Inicia um servidor local para visualizar a versão de produção.