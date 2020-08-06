#!/bin/bash 
echo "编译build"
npm run build
echo "开始执行构建前端项目:baymax为docker镜像名称 0.0.2为版本号"
docker build -t baymax:0.0.2 .
echo "停止旧容器 并删除旧容器"
docker stop baymax
docker rm baymax
echo "启动新容器"
docker container run -p 8000:8000 --name baymax -d baymax:0.0.2