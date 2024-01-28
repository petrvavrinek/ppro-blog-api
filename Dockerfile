###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18.19-buster As development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN yarn install --frozen-lockfile --production=false

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18.19-buster As build

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN yarn build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN yarn install --frozen-lockfile --production=true && yarn add sharp@0.33.2 --ignore-engines && yarn cache clean 

USER node

###################
# PRODUCTION
###################

FROM node:18.19-buster As production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Public directory
RUN mkdir ./public

RUN git clone https://github.com/vishnubob/wait-for-it.git

# Copy package json
COPY --chown=node:node ./package.json .
COPY --chown=node:node ./tsconfig.json .

# Start the server using the production build
CMD [ "node", "dist/src/main.js" ]