FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD ["node", "index.js"]
