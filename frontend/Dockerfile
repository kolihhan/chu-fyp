FROM node:16-alpine

WORKDIR /app/frontend/

COPY package*.json /app/frontend/

#install nodemon to provide hot-reloading functionality.
RUN npm install react-scripts
RUN npm install

COPY . /app/frontend/

#use nodemon to run the react application using npm.
# "nodemon", "--exec", 
CMD ["npm", "start"]