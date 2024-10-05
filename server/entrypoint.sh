#!/bin/sh
# Make migrations and migrate the database.
echo "Making migrations and migrating the database."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files."
python manage.py collectstatic --noinput

# Execute the provided CMD
exec "$@"
