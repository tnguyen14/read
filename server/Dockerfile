FROM mhart/alpine-node:10.15

# dependencies needed to build leveldown
RUN apk add --no-cache python make gcc g++

WORKDIR /src

COPY package.json /src/
COPY package-lock.json /src/
RUN npm install
COPY . /src/

CMD ["npm", "run", "server"]
