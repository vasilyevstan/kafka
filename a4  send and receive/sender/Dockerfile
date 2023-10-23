FROM  node:18
WORKDIR /usr/src/app
COPY package*.json sender.js .env ./
RUN npm install
EXPOSE 3000
CMD [ "node", "sender.js" ]