FROM node:23.11.1-alpine3.21
WORKDIR /usr/src/app
COPY ./address-book-app .
RUN npm install
EXPOSE 3000
CMD [ "node", "server.js" ]