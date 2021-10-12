FROM node:alpine as builder

COPY . .

RUN yarn install --registry=http://mirrors.tencentyun.com/npm
RUN yarn run build

WORKDIR /dist

# 选择更小体积的基础镜像
FROM nginx:alpine

COPY --from=builder /dist /usr/share/nginx/html

COPY --from=builder /dist/nginx.conf /etc/nginx/conf.d

EXPOSE 80