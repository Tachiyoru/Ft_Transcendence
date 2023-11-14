# Specifies the base image to be used to build the Docker image
FROM node:lts

# Installs the required packages
RUN apt-get update

# Sets the working directory
WORKDIR /frontend

# Installs project dependencies
COPY package.json package-lock.json ./
RUN npm install
COPY ./ ./

# Exposes port
EXPOSE 5173

# For prisma update
# CMD ["tail", "-f", "/dev/null"]

# Starts application
# CMD ["npm", "run", "dev"]

RUN npm add --no-cache curl

ENTRYPOINT npm install && npm run dev
