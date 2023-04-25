FROM node:16-alpine

COPY package.json /app/
WORKDIR /app/
RUN npm install
ENV PATH /data/node_modules/.bin:$PATH

COPY . /app/frontend/
WORKDIR /app/frontend/

#use nodemon to run the react application using npm.
# "nodemon", "--exec", 
CMD ["npm", "start"]