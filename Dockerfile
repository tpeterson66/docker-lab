FROM node:21.2-alpine3.18
WORKDIR /usr/src/app
COPY ./address-book-app .
RUN npm install
EXPOSE 3000
CMD [ "node", "server.js" ]