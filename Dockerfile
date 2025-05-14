FROM node:22

WORKDIR /app
COPY package.json /app

RUN npm install --legacy-peer-deps

COPY . /app
CMD ["node", "index.js"]

ENV PORT=3000
EXPOSE 3000

