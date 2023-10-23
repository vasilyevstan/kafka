FROM  node:18
WORKDIR /usr/src/app
COPY package*.json receiver.js .env ./
RUN apt-get update && \
    apt-get install -y 2ping
RUN npm install
EXPOSE 3000
CMD [ "node", "receiver.js" ]