lint-frontend:
	make -C frontend lint

install:
	npm ci

start-frontend:
	make -C frontend start

start-backend:
	npx start-server

build:
	npm run build

deploy:
	git push

start:
	make start-backend & make start-frontend
