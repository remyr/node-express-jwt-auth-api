FROM node
MAINTAINER rivals.remy@gmail.com

ADD . /code
WORKDIR /code

CMD nodemon index.js