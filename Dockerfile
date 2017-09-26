FROM node:latest
MAINTAINER Yuhang Ge

COPY index.js /opt/ftp-http-server/index.js
COPY package.json /opt/ftp-http-server/package.json
COPY package-lock.json /opt/ftp-http-server/package-lock.json
WORKDIR /opt/ftp-http-server
RUN npm install

EXPOSE 80 21

ENTRYPOINT ["npm", "start"]