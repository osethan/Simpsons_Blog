FROM node:carbon-alpine

WORKDIR /opt/webapp
COPY ./client/public /opt/webapp/public
COPY ./client/src /opt/webapp/src
COPY ./client/package.json /opt/webapp/package.json
COPY ./client/server.js /opt/webapp/server.js

RUN yarn install
RUN yarn build
RUN ln -s $PWD/node_modules/.bin/babel /usr/bin/babel
RUN babel ./server.js -o ./server-build.js

EXPOSE 3000

CMD node ./server-build.js
