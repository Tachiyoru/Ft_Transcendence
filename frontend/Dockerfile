# Specifies the base image to be used to build the Docker image
FROM node:lts

# Installs the required packages
RUN apt-get update

# Sets the working directory
WORKDIR /usr/src/app

# Installs project dependencies
COPY package.json package-lock.json ./
RUN npm install glob rimraf

RUN npm install
COPY . .

# RUN npm run build
CMD ["npm", "run", "dev"]