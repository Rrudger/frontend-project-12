install:
	npm ci

start-frontend:
	npm run start

lint:
	npm run lint

build:
	npm run build

push:
	git add .
	git commit -m 'update'
	git push

start:
	make build & make start-frontend
