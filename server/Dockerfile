FROM mhart/alpine-node:8.11

# dependencies needed to build leveldown
RUN apk add --no-cache python make gcc g++

WORKDIR /src

COPY package.json /src/
COPY package-lock.json /src/
RUN npm install
COPY . /src/

CMD ["npm", "start"]
