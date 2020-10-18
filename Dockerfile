FROM node:12-alpine

ENV PORT=8080
ENV NODE_ENV=development

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["node", "app.js"]