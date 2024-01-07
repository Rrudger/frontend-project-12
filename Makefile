lint-frontend:
	make -C frontend lint

install:
	npm ci
	cd frontend
	npm ci

build:
	npm run build

start:
	npm run start

start-frontend:
	make -C frontend start

start-backend:
	npx start-server

deploy:
	git push

start:
	make start-backend & make start-frontend
