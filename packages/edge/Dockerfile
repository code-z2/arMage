FROM node:16
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "npx", "ts-node-esm", "dist/index.js" ]

