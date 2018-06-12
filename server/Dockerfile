FROM node:carbon-alpine

WORKDIR /opt/webapp
COPY ./server/server.js /opt/webapp/server/server.js
COPY ./common /opt/webapp/common
COPY ./package.json /opt/webapp/package.json
COPY ./data/creator.json /opt/webapp/data/creator.json

RUN yarn install
RUN ln -s $PWD/node_modules/.bin/babel /usr/bin/babel
RUN babel . -d ./build --ignore ./node_modules,./yarn

EXPOSE 3030

CMD node ./build/server/server.js
