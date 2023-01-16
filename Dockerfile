# stage 1 as builder
FROM node:lts-alpine as builder

# Define folder
WORKDIR /usr/src/app

# Copy files
COPY . .

# Build the project
RUN npm install
RUN npm cache clean --force
RUN npm run build

# stage 2 as production-build
FROM nginx:alpine as production-build
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stage 1
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY ./entrypoint.sh /entrypoint.sh

# Define port and entrypoint
EXPOSE 8080
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]