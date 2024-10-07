# FROM node:18-slim as BUILD_IMAGE
FROM node:22-slim as build_image

WORKDIR /app/react-app

#Copy package.json
COPY package.json .

#Install packages
RUN npm install

#Copy files
COPY . .

#Build Project
RUN npm run build


# second stage
FROM node:22-slim as prod_image

WORKDIR /app/react-app 

#Copy the build output from BUILD IMAGE to /app/react-app/dist
COPY --from=build_image /app/react-app/dist/ /app/react-app/dist/

COPY package.json .
COPY vite.config.js .

RUN npm install esbuild
RUN npm install -g vite

EXPOSE 5000

CMD ["npm", "run", "preview"]


