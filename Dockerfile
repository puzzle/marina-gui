FROM exiasr/alpine-yarn-nginx:8.9.4

RUN mkdir /tmp/src

ADD . /tmp/src

RUN cd /tmp/src && yarn install && NODE_ENV=production yarn run build
RUN mv /tmp/src/build/* /usr/share/nginx/html/

# nginx cache
RUN mkdir -p /var/cache/nginx/{client_temp,fastcgi_temp,proxy_temp}
# nginx logs
RUN mkdir -p /var/log/nginx
RUN touch /var/log/nginx/{error,access}.log

# support running as arbitrary user which belogs to the root group
RUN chmod -R g+rwx /var/cache/nginx /var/run /var/log/nginx

# users are not allowed to listen on priviliged ports
RUN sed -i.bak 's/listen\(.*\)80;/listen 8080;/' /etc/nginx/conf.d/default.conf
EXPOSE 8080

# comment user directive as master process is run as user in OpenShift anyhow
RUN sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf

RUN addgroup nginx root
USER nginx
