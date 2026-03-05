#!/bin/bash

echo "=============================="
echo "Configurando ActiveAge"
echo "=============================="

cd backend

echo "Verificando .env..."

if [ ! -f .env ]; then
  cp .env.example .env
  echo ".env criado automaticamente"
else
  echo ".env já existe"
fi

echo "Instalando dependências..."

npm install

echo "=============================="
echo "Setup concluído"
echo "=============================="