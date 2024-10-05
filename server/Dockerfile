# Base image
FROM python:3.12.0-slim-bookworm

# Environment variables
ENV PYTHONBUFFERED=1
ENV PYTHONWRITEBYTECODE=1
ENV APP=/app

# Set the working directory
WORKDIR $APP

# Install system dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev

# Install Python dependencies
COPY requirements.txt $APP
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the project files
COPY . $APP

# Expose port 8000
EXPOSE 8000

# Make the entrypoint script executable
RUN chmod +x /app/entrypoint.sh

# Define entrypoint and command
ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]
CMD ["gunicorn", "--bind", ":8000", "--workers", "3", "djangoproj.wsgi"]
