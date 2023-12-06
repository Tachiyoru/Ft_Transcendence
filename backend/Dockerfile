# # Specifies the base image to be used to build the Docker image
# FROM node:lts

# # Installs the required packages
# RUN apt-get update

# # Sets the working directory
# WORKDIR /app

# # Installs project dependencies
# COPY package.json package-lock.json ./
# RUN npm install
# COPY ./ ./

# # Exposes port
# EXPOSE 5000

# # For prisma update
# # CMD ["tail", "-f", "/dev/null"]

# # Starts application
# CMD ["npm", "run", "start:migrate:dev"]

FROM node:lts AS development

WORKDIR backend/usr/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install

COPY . .

RUN npm run build
