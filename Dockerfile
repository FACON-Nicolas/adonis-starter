FROM node:21
WORKDIR /app
ADD package.json /app/package.json

RUN npm install

ADD . .
EXPOSE 8080

CMD ["npm", "run", "dev"]
