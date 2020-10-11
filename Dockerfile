FROM node:lts-alpine

WORKDIR /app

COPY website/dist /app/public
COPY server/assets /app/assets
COPY server/package.json /app/package.json
COPY yarn.lock /app/yarn.lock
COPY server/build /app/build

RUN yarn install

CMD ["yarn", "run", "start"]
