#!/bin/sh
# wait-for-db.sh

HOST="db"
PORT="5432"
TIMEOUT=30

echo "Aguardando o PostgreSQL em $HOST:$PORT..."

# Loop para tentar a conexão com o banco de dados
for i in $(seq 1 $TIMEOUT); do
  # Tenta conectar ao DB. O comando 'nc -z' verifica se a porta está aberta.
  nc -z $HOST $PORT && break

  if [ $i -eq $TIMEOUT ]; then
    echo "Timeout: O PostgreSQL não iniciou em $TIMEOUT segundos."
    exit 1
  fi

  echo "Tentativa $i/$TIMEOUT: PostgreSQL ainda indisponível. Aguardando 1 segundo..."
  sleep 1
done

echo "PostgreSQL está online! Iniciando o servidor Nest.js..."
# Execute o comando original para iniciar sua aplicação
exec npm run start:prod