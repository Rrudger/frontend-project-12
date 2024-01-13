lint-frontend:
	make -C frontend lint

install:
	npm install

start-frontend:
	make -C frontend start

start-backend:
	npx start-server

build:
	npm run build

start:
	make start-backend & make start-frontend
