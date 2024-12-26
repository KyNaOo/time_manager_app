# FROM node:lts-alpine

# # installe un simple serveur http pour servir un contenu statique
# RUN npm install -g http-server

# # définit le dossier 'app' comme dossier de travail
# WORKDIR /app

# # copie 'package.json' et 'package-lock.json' (si disponible)
# COPY package*.json ./

# # installe les dépendances du projet
# RUN npm install

# # copie les fichiers et dossiers du projet dans le dossier de travail (par exemple : le dossier 'app')
# COPY . .

# # # construit l'app pour la production en la minifiant
# RUN npm run build

# EXPOSE 5173

# CMD [ "http-server", "dist","--host","0.0.0.0","--port","5173" ]

# Use the node image from official Docker Hub
FROM node:16.10.0-alpine3.13 as buildstage
# set the working directory
WORKDIR /app
# Copy the working directory in the container
COPY package*.json ./
# Install the project dependencies
RUN npm install
# Copy the rest of the project files to the container
COPY . .
# Build the Vue.js application to the production mode to dist folder
RUN npm run build
# Use the lightweight Nginx image from the previous stage for the nginx container
FROM nginx:stable-alpine as production-stage
# Copy the build application from the previous stage to the Nginx container
COPY --from=buildstage /app/dist /usr/share/nginx/html
# Copy the nginx configuration file
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# Expose the port 80
EXPOSE 80
# Start Nginx to serve the application
CMD ["nginx", "-g", "daemon off;"]


