# Use a solid Python base
FROM python:3.11-slim

# ... (keep your ARG and apt-get lines the same) ...

WORKDIR /app

# FIX: Remove "portcyber_project/" prefix because the context is already that folder
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# FIX: Change this to copy everything from the current context
COPY . .

# Django prep
RUN python manage.py collectstatic --no-input

# Expose the port
EXPOSE 8000

# Start the engine
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "portcyber_project.wsgi"]