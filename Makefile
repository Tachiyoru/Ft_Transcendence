all: run

re: clean run

setup :
	@echo "Installing dependencies"
	cd backend && npm install
	cd frontend && npm install

run : down
	@echo "Building and running the app"
	docker-compose up --build

down :
	@echo "Stopping the app"
	docker compose down --rmi all --volumes

clean: down
	@echo "Cleaning up"
	rm -rf backend/prisma/migrations
	rm -rf backend/uploads
	docker system prune -af

reset_prisma:
	rm -rf backend/node_modules
	rm -rf backend/dist
	cd backend && npm install

.PHONY: all setup run down