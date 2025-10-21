FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./ 
RUN npm install

COPY . .

RUN npm run build


# ETAPA 2: PRODUÇÃO (Execução)
FROM node:20-alpine AS production

WORKDIR /app

# Instala o netcat, necessário para o script 'wait-for-db.sh'
RUN apk add --no-cache netcat-openbsd

# Copia o script de espera e o torna executável
# ASSUMIMOS que o arquivo 'wait-for-db.sh' está na pasta 'backend/'
COPY ./wait-for-db.sh .
RUN chmod +x ./wait-for-db.sh

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000

# Alterado: O CMD agora executa o script de espera antes de iniciar o servidor
CMD ["/app/wait-for-db.sh"]