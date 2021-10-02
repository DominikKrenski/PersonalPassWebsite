FROM nginx:1.21.3-alpine
COPY dist/ /usr/share/nginx/html
