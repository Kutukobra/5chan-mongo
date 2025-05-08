FROM node

WORKDIR /app
COPY package.json /app

RUN npm install --legacy-peer-deps

COPY . /app
CMD ["node", "index.js"]