#!/bin/sh

# remember.. the line endings in this file need to be unix format
# dos2unix services\users\entrypoint.sh

echo "Waiting for postgres..."

while ! nc -z users-db 5432; do
    sleep 0.1
done

echo "PostgreSQL started"

pwd
echo "what's in here.."
ls -al

python manage.py run -h 0.0.0.0