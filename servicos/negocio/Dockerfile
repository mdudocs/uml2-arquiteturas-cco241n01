FROM node:24-alpine
WORKDIR /app
COPY package.json ./
COPY *.js ./
ENV PORT=3001
EXPOSE 3001
CMD ["node", "server.js"]
