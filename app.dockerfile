FROM php:8.0.0RC4-fpm

RUN apt-get update && apt-get install -y  libmcrypt-dev \
    mysql-client libmagickwand-dev --no-install-recommends \
    && docker-php-ext-install mcrypt pdo_mysql
