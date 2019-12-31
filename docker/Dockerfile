FROM node:10
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 3000
EXPOSE 8080
CMD [ "node", "server.js" ]