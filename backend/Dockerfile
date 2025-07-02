# Use official Bun image
FROM oven/bun:1.1

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies (production only)
RUN bun install

# Copy rest of the application code
COPY . .

# Expose port (adjust if your app uses a different one)
EXPOSE 3001

# Start the Express.js app
CMD ["bun", "start"]
