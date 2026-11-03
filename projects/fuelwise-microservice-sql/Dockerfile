FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
COPY scripts ./scripts
COPY database ./database
USER node
EXPOSE 3002
HEALTHCHECK CMD node -e "fetch('http://localhost:'+(process.env.PORT||3002)+'/health/ready').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node","src/server.js"]
