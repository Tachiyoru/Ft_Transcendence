all: run

setup :
	@echo "Installing dependencies"
	cd Backend && npm install && npx prisma generate

run : setup
	@echo "Building and running the app"
	docker compose up --build

down :
	@echo "Stopping the app"
	docker compose down --rmi all --volumes

.PHONY: all setup run down