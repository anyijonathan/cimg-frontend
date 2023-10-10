# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app
EXPOSE 80
EXPOSE 443
EXPOSE 3000

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies

COPY package-lock.json ./
COPY package.json ./
RUN npm install -g npm@latest

# add app
COPY . ./

# start app
CMD ["npm", "start"]    

