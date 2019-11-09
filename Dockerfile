FROM node:10-alpine

ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT
ENV HOST 0.0.0.0

RUN npm i yarn@latest -g

RUN apk add --no-cache tini

RUN mkdir /opt/gqlblog && chown node:node /opt/gqlblog
WORKDIR /opt/gqlblog
USER node
COPY . .

ADD package.json yarn.lock /tmp/
RUN cd /tmp && yarn
RUN ln -sf /tmp/node_modules /opt/gqlblog/

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN yarn build

# HEALTHCHECK --interval=30s CMD node healthcheck.js

ENTRYPOINT [ "/sbin/tini" ]
CMD [ "./docker-entrypoint.sh" ]
