FROM node:alpine as builder

COPY . .

RUN npm install
RUN npm run build

ARG ACTIVE=prod

ENV ACTIVE ${ACTIVE}

COPY ./public/nginx-${ACTIVE}.conf  /dist/nginx.conf

WORKDIR /dist

# 选择更小体积的基础镜像
FROM nginx:alpine

COPY --from=builder /dist /usr/share/nginx/html

COPY --from=builder /dist/nginx.conf /etc/nginx/conf.d

EXPOSE 80