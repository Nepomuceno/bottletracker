.PHONY: install dev build preview test deploy clean help

# Default target
help:
	@echo "Bottle Tracker - Available Commands"
	@echo "===================================="
	@echo "make install  - Install dependencies"
	@echo "make dev      - Start development server"
	@echo "make build    - Build for production"
	@echo "make preview  - Preview production build"
	@echo "make test     - Run tests"
	@echo "make deploy   - Deploy to Netlify"
	@echo "make clean    - Clean build artifacts"
	@echo ""

# Install dependencies
install:
	bun install

# Start development server
dev:
	bun run dev

# Build for production
build:
	bun run build

# Preview production build
preview:
	bun run preview

# Run tests
test:
	bun run test

# Deploy to Netlify (requires netlify-cli)
deploy: build
	@echo "Deploying to Netlify..."
	@if command -v netlify >/dev/null 2>&1; then \
		netlify deploy --prod; \
	else \
		echo "Netlify CLI not found. Install with: bun add -g netlify-cli"; \
		echo "Or connect your GitHub repo to Netlify for auto-deploy."; \
	fi

# Deploy preview (not production)
deploy-preview: build
	@echo "Deploying preview to Netlify..."
	@if command -v netlify >/dev/null 2>&1; then \
		netlify deploy; \
	else \
		echo "Netlify CLI not found. Install with: bun add -g netlify-cli"; \
	fi

# Clean build artifacts
clean:
	rm -rf dist
	rm -rf .netlify
	rm -rf node_modules/.vite

# Setup Netlify (first time)
netlify-init:
	@if command -v netlify >/dev/null 2>&1; then \
		netlify init; \
	else \
		echo "Installing Netlify CLI..."; \
		bun add -g netlify-cli; \
		netlify init; \
	fi

# Link to existing Netlify site
netlify-link:
	@if command -v netlify >/dev/null 2>&1; then \
		netlify link; \
	else \
		echo "Netlify CLI not found. Install with: bun add -g netlify-cli"; \
	fi
