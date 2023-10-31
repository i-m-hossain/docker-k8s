FROM node:18.2

WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .

CMD [ "npm", "run","build"]

FROM nginx

