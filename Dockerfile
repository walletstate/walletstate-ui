FROM node:latest as build

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN npm install

RUN npm run build


FROM nginx:latest

LABEL "org.opencontainers.image.source"="https://github.com/walletstate/walletstate-ui"

COPY --from=build /usr/local/app/dist/walletstate/browser /usr/share/nginx/html

COPY docker/nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
