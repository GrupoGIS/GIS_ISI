FROM node:20

WORKDIR /app

# Copia os arquivos package.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
