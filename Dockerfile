FROM arm64v8/node
COPY . /usr/src/
WORKDIR /usr/src
RUN yarn --network-timeout 60000 --ignore-scripts
WORKDIR ./apollos-church-api
RUN yarn build
EXPOSE 4000
CMD [ "yarn", "start:prod" ]