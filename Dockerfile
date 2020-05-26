FROM node:alpine as builder

RUN mkdir /app && chown -R node:node /app
WORKDIR /app
USER node

COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .

RUN yarn

COPY --chown=node:node . .

# RUN yarn test
RUN yarn build

FROM node:alpine

ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT
ENV HOST 0.0.0.0
ENV NODE_ENV=production

RUN apk add --no-cache tini

RUN mkdir /app && chown -R node:node /app
WORKDIR /app
USER node

COPY --chown=node:node --from=builder "/app/package.json" .
COPY --chown=node:node --from=builder "/app/yarn.lock" .
COPY --chown=node:node --from=builder "/app/dist/" ./dist/
COPY --chown=node:node --from=builder "/app/public/" ./public/
COPY --chown=node:node --from=builder "/app/content/" ./content/
COPY --chown=node:node --from=builder "/app/.env" .

RUN yarn
RUN ls -la

# HEALTHCHECK --interval=30s CMD node healthcheck.js

ENTRYPOINT [ "/sbin/tini" ]
CMD [ "node", "./dist/index.js" ]
