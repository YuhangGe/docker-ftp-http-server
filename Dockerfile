FROM node:latest
MAINTAINER Yuhang Ge

RUN mkdir /opt/ftp-nginx
COPY index.js /opt/ftp-nginx/index.js
COPY package.json /opt/ftp-nginx/package.json
COPY package-lock.json /opt/ftp-nginx/package.json
WORKDIR /opt/ftp-nginx
RUN npm install

EXPOSE 80 21

CMD ["npm", "start"]