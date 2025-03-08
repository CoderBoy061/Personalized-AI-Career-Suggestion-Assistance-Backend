# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install
RUN npm install -g nodemon 

# Copy the entire project
COPY . .

# Expose port
EXPOSE 5000

# Start the application with nodemon
CMD ["npm", "run", "dev"]