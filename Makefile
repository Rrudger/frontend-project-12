install:
	npm ci

start-frontend:
	npm run start

lint:
	npm run lint

build:
	npm run build

start:
	make build & make start-frontend
