# Multi-stage Dockerfile for vid2gif-web-api

# Stage 1: Node/React build stage
FROM node:22-alpine AS frontend-builder

# Set working directory for frontend
WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package*.json ./frontend/

# Install dependencies
WORKDIR /app/frontend
RUN npm ci

# Copy frontend source code
COPY frontend/ .

# Build the React frontend (outputs to ../dist as per vite.config.ts)
RUN npm run build

# Stage 2: Main Python runtime
FROM python:3.14-slim AS runtime

# Install system dependencies including ffmpeg
RUN apt-get update && apt-get install -y \
    curl \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install uv using the official installer and verify installation
RUN curl -LsSf https://astral.sh/uv/install.sh | sh && \
    /root/.local/bin/uv --version && \
    ln -s /root/.local/bin/uv /usr/local/bin/uv

# Set working directory
WORKDIR /app

# Copy pyproject.toml and uv.lock for dependency installation
COPY pyproject.toml uv.lock ./

# Copy README.md file (required by pyproject.toml)
COPY README.md ./

# Copy Python source code FIRST
COPY src/ ./src/
COPY main.py .

# Install Python dependencies using uv without virtual environment
RUN uv pip install --system -e .

# Copy built frontend from the first stage
COPY --from=frontend-builder /app/dist ./dist/

# Expose port for the FastAPI application
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]