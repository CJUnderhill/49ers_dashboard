#!/bin/bash

# Seed DB
php /var/www/html/seed.php

# Start the Apache server in the background
php -S 0.0.0.0:80 -t public &

# Start the worker script in the background
php /var/www/html/utils/QueueWorker.php &

# Wait to keep the container running
wait
