# My-E-Lab 🧪🔬

Bem-vindo ao **My-E-Lab**! Este repositório é um sistema de gerenciamento de empréstimos de livros e materiais didáticos.

## Sobre o Projeto

O **My-E-Lab** foi criado com o intuito de aprender alguns conhecimento importantes em programação:

- CRUD (usuários, empréstimos, livros/materiais)
- Autenticação JWT
- Arquitetura modularizada
- Definição e utilização de endpoints
- React
- Banco de dados relacional (mysql)

## Estrutura do Repositório

O repositório está organizado da seguinte forma:

- **/backend**: Contém definições do servidor e do banco de dados e interações com o banco de dados.
- **/frontend**: Contém criação e estilização de páginas e requisições aos endpoints do servidor.

## Como Usar

1. Clone o repositório:
   ```bash
   git clone https://github.com/Henrique-Givisiez/My-E-Lab.git
   cd My-e-Lab

2. Instale as dependências necessárias
- Backend
   ```bash
   cd backend
   pip install -r requirements.txt 

- Frontend 
   ```bash
   cd frontend
   npm install

3. Crie o banco de dados e as tabelas necessárias
- Navegue até o diretório backend
    ```bash
    cd backend

- Inicie o mysql
    ```bash
    mysql -u root -p

- Após iniciar o mysql, digite
    ```bash
    source create_database.sql

4. Inicie o servidor
    ```bash
    python backend/app/run.py

5. Inicie o React
    ```bash
    cd frontend
    npm start