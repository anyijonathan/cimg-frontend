# Use a compatible Node.js version
FROM node:20.5.0-alpine

# Set working directory
WORKDIR /app

# Expose necessary ports
EXPOSE 80
EXPOSE 443
EXPOSE 3000

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install app dependencies
COPY package-lock.json ./
COPY package.json ./
RUN npm install

# Add app
COPY . ./

# Start app
CMD ["npm", "start"]
