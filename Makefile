lint-frontend:
	make -C frontend lint

install:
	npm ci

start-frontend:
	npm run start

build:
	npm run build

start:
	make start-frontend
