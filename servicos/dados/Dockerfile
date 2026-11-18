FROM node:24-alpine
WORKDIR /app
COPY package.json ./
COPY *.js ./
ENV PORT=3002 \
    DB_PATH=/data/academico.db
VOLUME /data
EXPOSE 3002
CMD ["node", "--disable-warning=ExperimentalWarning", "server.js"]
