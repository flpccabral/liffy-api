FROM node:latest

WORKDIR /liffy-api
COPY . .
RUN npm install
RUN npm install -g gulp
RUN gulp
EXPOSE 80
CMD npm start
