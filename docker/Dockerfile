# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./


# Bundle app source
COPY . .

# Install app dependencies
RUN npm install -g pnpm && pnpm install

# Install nodemon to watch file changes
RUN npm install -g nodemon

# Install ts-node to run application
RUN npm install -g ts-node

# Load environment variables from .env file
ARG PORT

# Set environment variables using the ARG values
ENV PORT=${PORT}

# Expose the port that the app will listen on
EXPOSE ${PORT}

# Define the command to run your application
CMD [ "pnpm", "run","dev" ]
