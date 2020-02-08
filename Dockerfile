FROM openjdk:8-jdk-stretch

WORKDIR /opt/express-freemarker

# NOTE: https://github.com/nodesource/distributions/blob/master/README.md
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -

RUN apt update --yes && \
  apt install --yes nodejs && \
  npm install --global yarn

COPY ./package.json ./yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . ./
