# Multi-stage Dockerfile for vid2gif-web-api

# Stage 1: Node/React build stage
FROM node:22-alpine AS frontend-builder

# Set working directory for frontend
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source code
COPY frontend/ .

# Build the React frontend
RUN npm run build

# Stage 2: Main Python runtime
FROM python:3.14-slim AS runtime

# Install system dependencies including ffmpeg
RUN apt-get update && apt-get install -y \
    curl \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install uv
RUN curl -LsSf https://astral.sh/uv/install.sh | sh && \
    ln -s /root/.cargo/bin/uv /usr/local/bin/uv

# Set working directory
WORKDIR /app

# Copy pyproject.toml and uv.lock for dependency installation
COPY pyproject.toml uv.lock ./

# Install Python dependencies using uv without virtual environment
RUN uv pip install --system -e .

# Copy Python source code
COPY src/ ./src/
COPY main.py .

# Copy built frontend from the first stage
COPY --from=frontend-builder /app/frontend/dist ./dist/

# Expose port for the FastAPI application
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]