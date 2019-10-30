# if you're doing anything beyond your local machine, please pin this to a specific version at https://hub.docker.com/_/node/
FROM node:10-alpine

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run

# default to port 3000 for node
ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT
ENV HOST 0.0.0.0

# RUN apk add --no-cache tini

# you'll likely want the latest yarn, regardless of node version, for speed and fixes
RUN npm i yarn@latest -g

RUN mkdir /opt/node_app && chown node:node /opt/node_app
WORKDIR /opt/node_app
USER node
COPY . .
RUN yarn
RUN yarn build

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# check every 30s to ensure this service returns HTTP 200
# HEALTHCHECK --interval=30s CMD node healthcheck.js

CMD ["node", "./dist/index.js" ]
