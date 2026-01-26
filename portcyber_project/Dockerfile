# Use a solid Python base
FROM python:3.11-slim

# Install system dependencies for Postgres and general tools
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Point to your subfolder
COPY portcyber_project/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copy the rest of the project
COPY portcyber_project/ .

# Django prep
RUN python manage.py collectstatic --no-input

# Expose the port
EXPOSE 8000

# Start the engine
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "portcyber_project.wsgi"]