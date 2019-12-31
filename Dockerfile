FROM node:alpine
WORKDIR /usr/src/app
COPY ./address-book-app .
RUN npm install
EXPOSE 3000
CMD [ "node", "server.js" ]