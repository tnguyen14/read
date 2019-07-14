FROM mhart/alpine-node:10.15

# dependencies needed to build leveldown
RUN apk add --no-cache python make gcc g++

WORKDIR /src

COPY server/package.json /src/
COPY server/package-lock.json /src/
RUN npm install
COPY server /src/

CMD ["npm", "run", "server"]
