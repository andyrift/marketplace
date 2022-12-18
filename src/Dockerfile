FROM node:19-alpine

WORKDIR /app

COPY package.json .

RUN npm install && npm cache clean --force

COPY . .

CMD ["node", "app.js"]

EXPOSE 80