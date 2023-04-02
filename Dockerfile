# syntax=docker/dockerfile:1

FROM node:18.15.0-bullseye AS truffle
WORKDIR /battle
RUN npm install -g truffle@~5.6.0

FROM truffle AS truffle-dev
CMD truffle develop & \
	npm run migrate & \
	truffle migrate --network develop && \
	truffle exec oracle/setOracle.js --network develop && \
	npm run oracle -- --network develop & \
	npm run oracleserver -- --network develop

FROM truffle AS truffle-prod
COPY . .
RUN npm install
CMD npm run oracle & \
	npm run oracleserver

FROM node:19.8.1-bullseye AS vue
WORKDIR /battle
CMD npm run dev

FROM nginx:1.23.3 AS vue-prod
WORKDIR /battle
COPY default.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html
