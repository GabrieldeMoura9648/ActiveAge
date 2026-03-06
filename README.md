# 🚀 Active Age - Plataforma de Telessaúde Geriátrica

![Status do Projeto](https://img.shields.io/badge/status-MVP_Concluído-brightgreen)

Este repositório contém o código-fonte do **Active Age**, um projeto integrador que visa desenvolver uma plataforma de telessaúde especializada em geriatria. A solução busca simplificar a jornada de cuidado do paciente idoso, desde a busca e agendamento até a realização da teleconsulta.

Este projeto foi desenvolvido como parte do 2º Semestre do curso de Desenvolvimento de Software Multiplataforma da Fatec Diadema - Luigi Papaiz.

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
* **XAMPP** (Ferramenta utilizada para rodar o banco de dados **MySQL**)
* **phpMyAdmin** (Para administração visual do banco de dados)
* **Git & GitHub** (Para versionamento de código)

---

## ▶️ Como Executar o Projeto

Para rodar este projeto com eficiência, automatizamos o processo de configuração. Certifique-se de ter o [Node.js](https://nodejs.org/) e o [XAMPP](https://www.apachefriends.org/pt_br/index.html) instalados em sua máquina.

### 1. Pré-requisitos
* **[Node.js](https://nodejs.org/):** Ambiente de execução do servidor.
* **[XAMPP](https://www.apachefriends.org/pt_br/index.html):** Necessário para executar o serviço **MySQL**.

### 2. Clonar o Repositório
```bash
git clone [https://github.com/GabrieldeMoura9648/ActiveAge.git](https://github.com/GabrieldeMoura9648/ActiveAge.git)
cd ActiveAge

```

### 3. Configuração do Banco de Dados

1. Abra o Painel do XAMPP e inicie o módulo **MySQL**.
2. Acesse o phpMyAdmin em `http://localhost/phpmyadmin`.
3. No menu da esquerda, clique em **"Novo"** (ou "New").
4. Dê o nome ao banco de dados: **`activeage`**.
5. No campo de Agrupamento (Collation), selecione: `utf8mb4_general_ci`.
6. Clique em **"Criar"**.
7. Com o banco `activeage` selecionado, clique na aba **"Importar"** no menu superior.
8. Selecione o arquivo `backend/schema.sql` e clique em **"Executar"** no final da página.

### 4. Configuração do Ambiente

1. Navegue até a pasta `backend/`.
2. Faça uma cópia do arquivo `.env.example` e renomeie-o para `.env`.
3. Abra o arquivo `.env` e preencha os campos `DB_USER` e `DB_PASSWORD` com as credenciais do seu MySQL local (geralmente `root` e senha vazia no XAMPP). Garanta que `DB_NAME` esteja como `activeage`.

### 5. Primeira Execução

Apenas na primeira vez, execute o script de instalação para preparar as dependências:

```bash
bash setup.sh

```

### 6. Executando o Projeto

Para iniciar o servidor, utilize o script de execução:

```bash
bash run.sh

```

*O servidor estará rodando na porta 3000.*

### 7. Acessar o Front-end

Abra o seu navegador e acesse a página do projeto. Certifique-se de que o backend está rodando no terminal.

---

## 👨‍💻 Autores

* **Daniel Felipe Ferreira**
* **Gabriel de Moura**
* **Guilherme dos Santos Silva**
