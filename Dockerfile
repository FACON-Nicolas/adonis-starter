FROM node:21
WORKDIR /app
ADD package.json /app/package.json

RUN npm install --silent

ADD . .
EXPOSE 8080

CMD ["npm", "run", "dev"]
