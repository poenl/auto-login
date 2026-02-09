FROM node:22.21.1-alpine3.23
WORKDIR /run
COPY package.json .
COPY pnpm-lock.yaml .
RUN npm i -g pnpm
RUN pnpm i
RUN pnpm puppeteer browsers install chrome
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]