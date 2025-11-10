# 🚀 Active Age - Plataforma de Telessaúde Geriátrica

![Status do Projeto](https://img.shields.io/badge/status-MVP_Concluído-brightgreen)

Este repositório contém o código-fonte do **Active Age**, um projeto integrador que visa desenvolver uma plataforma de telessaúde especializada em geriatria. A solução busca simplificar a jornada de cuidado do paciente idoso, desde a busca e agendamento até a realização da teleconsulta.

Este projeto foi desenvolvido como parte do 2º Semestre do curso de Análise e Desenvolvimento de Sistemas da Fatec Diadema - Luigi Papaiz.

---

## 📋 Índice

* [Funcionalidades](#-funcionalidades)
* [Tecnologias Utilizadas](#️-tecnologias-utilizadas)
* [Como Executar o Projeto](#️-como-executar-o-projeto)
* [Autores](#-autores)

---

## ✨ Funcionalidades

O MVP (Produto Mínimo Viável) da plataforma Active Age implementa os seguintes Casos de Uso (UCs):

### 🧑‍⚕️ Fluxo do Médico
* **Autenticação:** Cadastro e Login seguros com criptografia de senha (`bcrypt`) e tokens (`JWT`).
* **Gestão de Perfil:** Médicos podem preencher seus dados profissionais (CRM, Biografia, Especializações) após o cadastro para serem "Aprovados" na plataforma.
* **Gestão de Agenda:** Médicos podem cadastrar seus "slots" de horários disponíveis (ex: 10:00 - 10:30) para atendimento.
* **Gestão de Consultas:** Médicos podem visualizar suas consultas futuras e cancelar agendamentos (liberando o horário).

### 👴 Fluxo do Paciente/Cuidador
* **Autenticação:** Cadastro e Login seguros.
* **Busca de Médicos:** Pacientes podem ver uma lista de todos os médicos "Aprovados" na plataforma.
* **Visualização de Agenda:** Pacientes podem selecionar um médico e ver todos os seus horários disponíveis.
* **Agendamento:** Pacientes podem escolher um "slot" de horário e agendar uma consulta. O sistema "trava" o horário no banco de dados.
* **Gestão de Consultas:** Pacientes podem visualizar suas consultas futuras e cancelar agendamentos.

### 💻 Fluxo Comum
* **Sala Virtual:** Paciente e Médico podem acessar uma página de "sala virtual" (mockup) no horário da consulta, simulando a teleconsulta integrada.

---

## 🛠️ Tecnologias Utilizadas

Este projeto é dividido em duas partes principais: `frontend` (o que o usuário vê no navegador) e `backend` (o "cérebro" que roda no servidor).

### **Front-end**
* **HTML5**
* **CSS3**
* **JavaScript (ES6+)**
* **Bootstrap 5** (Para design responsivo e componentes de UI)
* **Fetch API** (Para comunicação com o back-end)

### **Back-end**
* **Node.js** (Ambiente de execução)
* **Express.js** (Framework para criar a API RESTful)
* **MySQL** (Banco de dados relacional)
* **`mysql2`** (Driver de conexão Node.js para MySQL)
* **`bcrypt`** (Para criptografia de senhas)
* **`jsonwebtoken` (JWT)** (Para autenticação e gerenciamento de sessão)
* **`cors`** (Para permitir a comunicação entre front e back-end)

### **Ambiente e Ferramentas**
* **XAMPP** (Para gerenciamento local do servidor Apache e do banco de dados MySQL)
* **phpMyAdmin** (Para administração visual do banco de dados)
* **Git & GitHub** (Para versionamento de código)

---

## ▶️ Como Executar o Projeto

Para executar este projeto localmente, você precisará ter o [Node.js](https://nodejs.org/) e o [XAMPP](https://www.apachefriends.org/pt_br/index.html) instalados.

### 1. Pré-requisitos (Instalação)

1.  **Node.js:** Instale a versão LTS do [Node.js](https://nodejs.org/).
2.  **XAMPP:** Instale o [XAMPP](https://www.apachefriends.org/pt_br/index.html). Após a instalação, inicie o Painel de Controle do XAMPP e dê "Start" nos módulos **Apache** e **MySQL**.
3.  **Verificação:** Garanta que ambos os módulos ficaram verdes. O MySQL utilizará a porta padrão `3306`. (Caso esta porta esteja ocupada, o XAMPP exibirá um erro e você precisará liberar a porta ou reconfigurá-lo).

### 2. Clonar o Repositório

```bash
git clone https://github.com/GuilhermeSilva-25/ActiveAge.git
```

### 3. Configurar o Banco de Dados

1.  Abra seu navegador e acesse o phpMyAdmin: `http://localhost/phpmyadmin`
2.  No menu da esquerda, clique em **"Novo"** (ou "New").
3.  Dê o nome ao banco de dados: `active_age_db`
4.  No campo de Agrupamento (Collation), selecione: `utf8mb4_general_ci`
5.  Clique em **"Criar"**.
6.  Com o banco `active_age_db` selecionado, clique na aba **"Importar"** (ou "Import") no menu superior.
7.  Clique em "Escolher arquivo" e selecione o arquivo `banco.sql` que está dentro da pasta `backend` do projeto (`backend/banco.sql`).
8.  Clique em **"Executar"** (ou "Go") no final da página.

*Ao final, você deverá ver uma mensagem de sucesso e as tabelas `usuarios`, `medico_detalhes`, `horarios_disponiveis`, e `agendamentos` aparecerão no menu da esquerda.*

### 4. Configurar o Back-end

1.  Abra um terminal e navegue até a pasta do back-end:
    ```bash
    cd backend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Crie um arquivo chamado `.env` na raiz da pasta `backend`.
4.  Copie o conteúdo abaixo para dentro do seu `.env` (este arquivo é ignorado pelo Git):
    ```ini
    # Configuração do Banco de Dados (Padrão XAMPP)
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=active_age_db
    DB_PORT=3306

    # Segredo do Token JWT
    JWT_SECRET=meu_segredo_super_secreto_para_o_pi_2025
    ```

5.  Inicie o servidor back-end:
    ```bash
    npm run dev
    ```
    *Seu terminal deve mostrar: "Servidor rodando na porta 3000" e "Banco de dados conectado com sucesso!".*

### 5. Executar o Front-end

1.  Abra o projeto no **VS Code**.
2.  Instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
3.  Clique com o botão direito no arquivo `frontend/index.html`.
4.  Selecione **"Open with Live Server"**.

Seu navegador abrirá automaticamente e a aplicação estará 100% funcional, conectando-se ao seu back-end local.

---

## 👨‍💻 Autores

* **Daniel Felipe Ferreira**
* **Gabriel de Moura**
* **Guilherme dos Santos Silva**
