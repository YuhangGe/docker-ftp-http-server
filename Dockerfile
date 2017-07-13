FROM debian:jessie

RUN apt-get update && apt-get install --no-install-recommends --no-install-suggests -y nginx

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
	&& ln -sf /dev/stderr /var/log/nginx/error.log
COPY nginx_host.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443

# install vsftpd
RUN groupadd -g 48 ftp && \
    useradd --no-create-home --home-dir /files -s /bin/false --uid 48 --gid 48 -c 'ftp daemon' ftp
RUN apt-get update \
    && apt-get install -y --no-install-recommends vsftpd db5.3-util whois \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /var/run/vsftpd/empty /etc/vsftpd/user_conf /var/ftp /files && \
    touch /var/log/vsftpd.log && \
    rm -rf /files/ftp
COPY vsftpd*.conf /etc/
COPY vsftpd_virtual /etc/pam.d/
COPY *.sh /

VOLUME ["/files"]

EXPOSE 21 4559 4560 4561 4562 4563 4564

ENTRYPOINT ["/entry.sh"]
CMD ["vsftpd-nginx"]
