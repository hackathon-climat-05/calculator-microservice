FROM node:lts

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json .

# The access token for the GitHub Package registry
ARG NODE_AUTH_TOKEN

# Setup registry credentials
RUN if [ ! -z "$NODE_AUTH_TOKEN" ]; then echo "//npm.pkg.github.com/:_authToken=$NODE_AUTH_TOKEN" > .npmrc; fi

# Install app dependencies
RUN npm ci --omit=dev

# Bundle app source
COPY . .

CMD [ "npm", "start" ]
