lint-frontend:
	make -C frontend lint

install:
	npm ci

build:
	cd frontend
	npm run build

start-frontend:
	make -C frontend start

start-backend:
	npx start-server

deploy:
	git push

start:
	make start-backend & make start-frontend
