# Specifies the base image to be used to build the Docker image
FROM node:lts

# Installs the required packages
RUN apt-get update

# Sets the working directory
WORKDIR /app

# Installs project dependencies
COPY package.json package-lock.json ./
RUN npm install
COPY ./ ./

# Exposes port
EXPOSE 5000

# Starts application
CMD ["npm", "run", "start:migrate:dev"]
