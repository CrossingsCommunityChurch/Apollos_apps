FROM node:10-alpine
COPY . /usr/src/
WORKDIR /usr/src
RUN yarn --ignore-scripts
WORKDIR ./apollos-church-api
RUN yarn build
EXPOSE 4000
CMD [ "yarn", "start:prod" ]