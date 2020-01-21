FROM node:12 AS build

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package*.json ./

# Bundle app source
COPY . /app

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

RUN npm run build

FROM nginx:alpine
# copy the build folder from react to the root of nginx (www)
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
# start nginx 
CMD ["nginx", "-g", "daemon off;"]
