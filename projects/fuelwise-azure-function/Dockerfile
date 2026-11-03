# Development HTTP adapter. Cloud uses Azure Functions host, not this image.
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
USER node
EXPOSE 7071
CMD ["node","src/local.js"]
