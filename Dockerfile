FROM exiasr/alpine-yarn-nginx:8.9.4

RUN mkdir /tmp/src

ADD . /tmp/src

RUN cd /tmp/src && yarn install && NODE_ENV=production yarn run build && \
    mv /tmp/src/build/* /usr/share/nginx/html/ && \
    mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/fastcgi_temp /var/cache/nginx/proxy_temp /var/cache/nginx/uwsgi_temp /var/log/nginx && \
    touch /var/log/nginx/error.log /var/log/nginx/access.log && \
    chown -R root.root /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html/runtime-env.js && \
    chmod -R ug+rwx /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html/runtime-env.js && \
    mv /tmp/src/nginx/default.conf /etc/nginx/conf.d/default.conf && \
    mv /tmp/src/nginx/nginx.conf /etc/nginx/nginx.conf && \
    rm -rf /tmp/src && \
    addgroup nginx root

EXPOSE 8080

USER nginx

CMD echo "window.env = { REACT_APP_STAGE: '${STAGE}' }" > /usr/share/nginx/html/runtime-env.js && exec nginx -g "daemon off;"
