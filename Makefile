lint-frontend:
	make -C frontend lint

install:
	npm ci

start-frontend:
	make -C frontend start

start-backend:
	npx start-server

deploy:
	git push heroku main

build:
	npm run build

run:
	npm run build & npm run start  & npm run run

start:
	npm run start
