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
* **HTML5**, **CSS3**, **JavaScript (ES6+)**
* **Bootstrap 5** (Design responsivo)
* **Fetch API** (Comunicação com o backend)

### **Back-end**
* **Node.js** (Ambiente de execução)
* **Express.js** (Framework API)
* **MySQL** (Banco de dados)
* **`bcrypt`** (Segurança)
* **`jsonwebtoken` (JWT)** (Autenticação)

### **Ambiente e Ferramentas**
* **XAMPP** (Gerenciamento de MySQL)
* **phpMyAdmin** (Administração do banco)
* **Git & GitHub** (Versionamento)

---

## ▶️ Como Executar o Projeto

Para garantir que o projeto rode sem erros, siga as etapas abaixo:

### 1. Pré-requisitos
Certifique-se de ter instalado em sua máquina:
* **[Node.js](https://nodejs.org/)**: Recomendado versão LTS.
* **[XAMPP](https://www.apachefriends.org/pt_br/index.html)**: Para rodar o banco de dados MySQL.

### 2. Clonar o Repositório
Abra seu terminal na pasta onde deseja salvar o projeto e execute:
```bash
git clone [https://github.com/GabrieldeMoura9648/ActiveAge.git](https://github.com/GabrieldeMoura9648/ActiveAge.git)
cd ActiveAge

```

### 3. Configuração do Banco de Dados

1. **Inicie o serviço MySQL:**
* **Windows:** Abra o "XAMPP Control Panel", localize **MySQL** e clique em **"Start"**.
* **Linux:** No terminal, digite `sudo /opt/lampp/lampp start` e digite sua senha.


2. **Crie o Banco:**
* Acesse `http://localhost/phpmyadmin` no navegador.
* Clique em **"Novo"** (lado esquerdo).
* Nome do banco: `activeage`.
* Collation: `utf8mb4_general_ci`.
* Clique em **"Criar"**.


3. **Importe os dados:**
* Com o banco `activeage` selecionado, clique na aba **"Importar"** (topo da página).
* Selecione o arquivo `backend/schema.sql` do seu projeto.
* Clique em **"Executar"**.



### 4. Configuração das Variáveis de Ambiente

1. Navegue até a pasta `backend/`.
2. O projeto utiliza um arquivo `.env` para segurança. Localize o arquivo `backend/.env.example` e faça uma cópia dele renomeando para `backend/.env`.
3. Abra este novo arquivo `.env` e confirme se os dados estão assim:
```ini
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=activeage
DB_PORT=3306

```



### 5. Primeira Instalação

Apenas na primeira vez, você precisa instalar as bibliotecas necessárias. No terminal, na raiz do projeto, execute:

```bash
bash setup.sh

```

### 6. Executando o Projeto

Para iniciar o servidor, execute:

```bash
bash run.sh

```

*O servidor estará rodando na porta 3000.*

### 7. Acessar o Sistema

Abra seu navegador e acesse: `http://localhost:3000` (ou o endereço configurado no seu front-end).

---

## 👨‍💻 Autores

* **Daniel Felipe Ferreira**
* **Gabriel de Moura**
* **Guilherme dos Santos Silva**
