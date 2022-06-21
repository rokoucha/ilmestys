FROM node:18-bullseye AS build

ENV NODE_ENV development

WORKDIR /app

COPY .yarn/ /app/.yarn/
COPY .yarnrc.yml /app/.yarnrc.yml
COPY tsconfig.json /app/tsconfig.json
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN yarn install --immutable

COPY src/ /app/src/

RUN yarn run build

FROM node:18-bullseye-slim

ENV NODE_ENV production

WORKDIR /app

COPY .yarn/ /app/.yarn/
COPY .yarnrc.yml /app/.yarnrc.yml
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
COPY index.html /app/index.html

RUN yarn install --immutable

COPY --from=build /app/dist/ /app/dist/

EXPOSE 3000

CMD ["yarn", "run", "start"]
