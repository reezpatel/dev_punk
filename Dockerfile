FROM node:lts-alpine

WORKDIR /app

COPY website/dist /app/public
COPY server/assets /app/assets
COPY server/package.json /app/package.json
COPY server/build /app/build

RUN yarn .

CMD ["yarn", "start"]
