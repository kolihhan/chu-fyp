## 目錄結構

- postgresql
	- data #系統自動備份的 postgresql 資料

- Django
	- backend #專案放置位子
	- Dockerfile #建置 Django 的 Dockerfile

- React 
	- frontend #專案放置位子
	- Dockerfile #建置 React 的 Dockerfile
## Docker 配置分三個容器

1. Backend - Django
2. Frontend - React
3. DB - PostgreSQL

> 1為主要容器，容器名稱預設為 chu-fyp-backend-1 可在 docker-compose 內自定義(docker compose services底下的name) 

#### 如何初始化Images ?
> 在根目錄chu-fyp執行 docker-compose build

#### 如何啟用容器 ?
> 在根目錄chu-fyp執行 docker-compose up

#### 如何在容器內下指令 ?
> docker exec -it {容器名稱} /bin/sh

#### 如何得知當前執行容器與其名稱 ?
> docker ps



## 引用

[Dockfile、Docker Compose 建立環境](https://dev.to/anjalbam/dockerize-a-django-react-and-postgres-application-with-docker-and-docker-compose-by-anjal-bam-e0a)

[React、Django 教學](https://www.youtube.com/watch?v=tYKRAXIio28&t=3168s&ab_channel=DennisIvy)

## 專案狀態

> feat : 新增功能或物件 \
> fix : 修復功能或物件