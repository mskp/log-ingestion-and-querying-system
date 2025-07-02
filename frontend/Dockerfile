# Step 1: Build stage
FROM oven/bun:1.1 as builder

WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install

# Copy source code
COPY . .

# Build Vite app
RUN bun run build


# Step 2: Production stage (serving static files)
FROM nginx:alpine

# Copy built files to Nginx public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
