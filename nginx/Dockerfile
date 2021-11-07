FROM nginx

RUN rm /etc/nginx/conf.d/*.conf
COPY nginx.conf /etc/nginx/
COPY ./host-glanz-ready.conf /etc/nginx/conf.d/proxy.conf
COPY run.sh /usr/local/bin
RUN chmod +x /usr/local/bin/run.sh

WORKDIR /var/www/public

#RUN apt-get update || true
#RUN apt-get install vim --assume-yes
#RUN apt-get install curl --assume-yes

ENTRYPOINT ["run.sh"]
