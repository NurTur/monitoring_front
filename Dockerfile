FROM nginx:1.13-alpine
MAINTAINER Ivan Kondratyev <peacetoall123@gmail.com>

RUN    rm -f /etc/nginx/conf.d/default.conf \
    && rm -f /usr/share/nginx/html/index.html

WORKDIR /usr/share/nginx/html

COPY dist/my-app /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/
