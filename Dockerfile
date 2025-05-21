FROM node:slim

RUN mkdir -p /app

WORKDIR /app
COPY package*.json ./

COPY ./src ./src
# COPY ./public ./public

RUN npm install --legacy-peer-deps \
    && npm run start \
    && rm -fr node_modules

CMD ["node", "index.js"]

ENV PORT=3000
EXPOSE 3000
