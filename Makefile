lint-frontend:
	make -C frontend lint

install:
	npm install

start-frontend:
	npm run start

start-backend:
	npx start-server

build:
	npm run build

start:
	make start-frontend & make start-backend

run-app:
	make buid & make start
