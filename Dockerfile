# Node com major fixo: a tag lts muda de versão sozinha
FROM node:24-alpine3.22 AS builder
WORKDIR /modulo-web
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY angular.json tsconfig*.json ./
COPY public ./public
COPY src ./src
# environment.ts é ignorado no git; o build de produção troca ele pelo environment.production.ts
RUN cp src/environments/environment.production.ts src/environments/environment.ts && yarn build

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /modulo-web/dist/helius-web-portal/browser /usr/share/nginx/html
