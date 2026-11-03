FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY app.js server.js ./
USER node
EXPOSE 8080
HEALTHCHECK CMD node -e "fetch('http://localhost:8080/health/live').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node","server.js"]
