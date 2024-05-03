#!/bin/sh

# Substitute environment variables in NGINX configuration template
envsubst '${WALLETSTATE_SERVER}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start NGINX
exec nginx -g 'daemon off;'
