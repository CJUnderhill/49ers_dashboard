# Use a PHP image with Apache
FROM php:8.1-apache

# Install any required PHP extensions
RUN apt-get update && apt-get install -y zlib1g-dev libzip-dev unzip
RUN docker-php-ext-install pdo pdo_mysql zip

# Install Composer
COPY --from=composer/composer:latest-bin /composer /usr/local/bin/composer

# Copy application code to the container
COPY . /var/www/html

# Set working directory
WORKDIR /var/www/html

# Install PHP dependencies
RUN composer install

RUN chmod +x ./start.sh

# Expose port 80 for the PHP server
EXPOSE 80

# Run the start script
CMD ["./start.sh"]
