FROM node
COPY . /usr/src/
WORKDIR /usr/src
RUN yarn
RUN yarn build
EXPOSE 4000
CMD [ "yarn", "start:prod" ]