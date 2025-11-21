.PHONY: help install dev build start lint clean docker-build docker-up docker-down docker-logs docker-shell docker-clean docker-restart

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

##@ Help

help: ## Display this help message
	@echo "$(BLUE)Price Matrix - Available Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf ""} /^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

install: ## Install dependencies using pnpm
	@echo "$(BLUE)Installing dependencies...$(NC)"
	pnpm install

dev: ## Start development server
	@echo "$(BLUE)Starting development server...$(NC)"
	pnpm dev

build: ## Build the application for production
	@echo "$(BLUE)Building application...$(NC)"
	pnpm build

start: ## Start production server
	@echo "$(BLUE)Starting production server...$(NC)"
	pnpm start

lint: ## Run ESLint
	@echo "$(BLUE)Running linter...$(NC)"
	pnpm lint

clean: ## Clean build artifacts and node_modules
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	rm -rf .next
	rm -rf node_modules
	rm -rf dist
	rm -rf out

##@ Docker

docker-build: ## Build Docker image
	@echo "$(BLUE)Building Docker image...$(NC)"
	docker build -t price-matrix .

docker-up: ## Start Docker container using docker compose (PORT=3001 to use different port)
	@echo "$(BLUE)Starting Docker containers on port $${PORT:-3000}...$(NC)"
	@PORT=$${PORT:-3000} docker compose up -d

docker-up-build: ## Build and start Docker containers (PORT=3001 to use different port)
	@echo "$(BLUE)Building and starting Docker containers on port $${PORT:-3000}...$(NC)"
	@PORT=$${PORT:-3000} docker compose up -d --build

docker-down: ## Stop Docker containers
	@echo "$(YELLOW)Stopping Docker containers...$(NC)"
	docker compose down

docker-logs: ## View Docker container logs
	@echo "$(BLUE)Viewing Docker logs...$(NC)"
	docker compose logs -f

docker-logs-tail: ## View last 100 lines of Docker logs
	@echo "$(BLUE)Viewing last 100 lines of Docker logs...$(NC)"
	docker compose logs --tail=100

docker-shell: ## Open shell in running Docker container
	@echo "$(BLUE)Opening shell in Docker container...$(NC)"
	docker compose exec app sh

docker-restart: ## Restart Docker containers
	@echo "$(BLUE)Restarting Docker containers...$(NC)"
	docker compose restart

docker-clean: ## Stop containers and remove images/volumes for this project only
	@echo "$(YELLOW)Cleaning Docker resources for this project...$(NC)"
	docker compose down -v --rmi local 2>/dev/null || true
	docker rmi price-matrix 2>/dev/null || true
	@echo "$(GREEN)Project Docker resources cleaned!$(NC)"

docker-run: ## Run Docker container directly (PORT=3001 to use different port)
	@echo "$(BLUE)Running Docker container on port $${PORT:-3000}...$(NC)"
	docker run -p $${PORT:-3000}:3000 --env-file .env.local price-matrix

docker-run-detached: ## Run Docker container in detached mode (PORT=3001 to use different port)
	@echo "$(BLUE)Running Docker container in detached mode on port $${PORT:-3000}...$(NC)"
	docker run -d -p $${PORT:-3000}:3000 --name price-matrix --env-file .env.local price-matrix

docker-stop: ## Stop running Docker container
	@echo "$(YELLOW)Stopping Docker container...$(NC)"
	docker stop price-matrix 2>/dev/null || true
	docker rm price-matrix 2>/dev/null || true

##@ Combined Commands

setup: install ## Install dependencies (alias for install)
	@echo "$(GREEN)Setup complete!$(NC)"

docker-full: docker-build docker-up-build ## Build and start Docker containers (full setup) (PORT=3001 for custom port)
	@echo "$(GREEN)Docker setup complete on port $${PORT:-3000}!$(NC)"

rebuild: clean install build ## Clean, install, and build from scratch
	@echo "$(GREEN)Rebuild complete!$(NC)"

docker-rebuild: docker-clean docker-build docker-up-build ## Clean Docker resources and rebuild (PORT=3001 for custom port)
	@echo "$(GREEN)Docker rebuild complete on port $${PORT:-3000}!$(NC)"

##@ Utilities

check-env: ## Check if .env.local file exists
	@if [ ! -f .env.local ]; then \
		echo "$(YELLOW)Warning: .env.local file not found$(NC)"; \
		echo "Creating .env.local from template..."; \
		echo "PORT=3000" > .env.local; \
		echo "NODE_ENV=production" >> .env.local; \
		echo "$(GREEN).env.local created!$(NC)"; \
	else \
		echo "$(GREEN).env.local exists$(NC)"; \
	fi

status: ## Show status of Docker containers
	@echo "$(BLUE)Docker Container Status:$(NC)"
	@docker compose ps || echo "No containers running"

info: ## Show project information
	@echo "$(BLUE)Price Matrix Project Information$(NC)"
	@echo ""
	@echo "Node version: $$(node --version 2>/dev/null || echo 'Not installed')"
	@echo "pnpm version: $$(pnpm --version 2>/dev/null || echo 'Not installed')"
	@echo "Docker version: $$(docker --version 2>/dev/null || echo 'Not installed')"
	@echo "Docker Compose version: $$(docker compose version 2>/dev/null || echo 'Not installed')"
	@echo ""
	@echo "$(BLUE)Environment:$(NC)"
	@if [ -f .env.local ]; then \
		echo "$(GREEN).env.local exists$(NC)"; \
	else \
		echo "$(YELLOW).env.local not found$(NC)"; \
	fi

