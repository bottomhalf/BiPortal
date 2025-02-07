#   BUILD STAGE 1

FROM node:14.16.1 as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -- --configuration production

# STAGE 2
FROM nginx:alpine
COPY --from=node /app/dist/odbui /usr/share/nginx/html
