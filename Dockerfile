FROM nginx

LABEL name = "baymax"
LABEL version ="0.0.2"

COPY ./dist /usr/share/nginx/html
COPY ./baymax.conf  /etc/nginx/conf.d

EXPOSE 8000
