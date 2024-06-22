FROM node:20-alpine

WORKDIR /app

COPY ./ ./

RUN npm i

RUN npm run build
# RUN npx nuxi preview [.] [../.env]

ENTRYPOINT [ "node", ".output/server/index.mjs" ]