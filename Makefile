.PHONY: install start dev clean

install:
	@echo "Installing dependencies..."
	npm install

start:
	@echo "Starting server..."
	npm start

dev:
	@echo "Starting development server..."
	npm run dev

clean:
	@echo "Cleaning up..."
	rm -f streams.db
	rm -rf node_modules 