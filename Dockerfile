FROM node:lts-alpine
WORKDIR /usr/src/app
COPY . .
RUN apk update