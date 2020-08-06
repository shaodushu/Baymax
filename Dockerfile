# FROM node:latest

# # 指定容器的工作目录为 /app 
# WORKDIR /app             
# # 把当前目录所有内容拷贝到目录/app。拷贝内容受.dockerignore影响
# COPY . /app              

# RUN rm -f package-lock.json \
#     ; rm -rf .idea \
#     ; rm -rf node_modules \
#     ; npm config set registry "https://registry.npm.taobao.org/" \
#     && npm install \
#     && npm run build

FROM nginx

LABEL name = "baymax"
LABEL version ="0.0.2"

COPY ./dist /usr/share/nginx/html
COPY ./baymax.conf  /etc/nginx/conf.d

EXPOSE 8000
