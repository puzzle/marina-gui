FROM exiasr/alpine-yarn-nginx:8.9.4

RUN mkdir /tmp/src

ADD . /tmp/src

RUN cd /tmp/src && yarn install && NODE_ENV=production yarn run build
RUN mv /tmp/src/build/* /usr/share/nginx/html/

# nginx cache
RUN mkdir -p /var/cache/nginx/client_temp
RUN mkdir -p /var/cache/nginx/fastcgi_temp
RUN mkdir -p /var/cache/nginx/proxy_temp
RUN mkdir -p /var/cache/nginx/uwsgi_temp

# nginx logs
RUN mkdir -p /var/log/nginx
RUN touch /var/log/nginx/error.log
RUN touch /var/log/nginx/access.log

# support running as arbitrary user which belogs to the root group
RUN chmod -R a+rwx /var/cache/nginx /var/run /var/log/nginx

RUN mv /tmp/src/nginx/default.conf /etc/nginx/conf.d/default.conf
RUN mv /tmp/src/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

RUN addgroup nginx root
USER nginx
