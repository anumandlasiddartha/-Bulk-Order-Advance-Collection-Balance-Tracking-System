# Use slim Python build image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set env parameters
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FLASK_ENV=production

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy dependencies list
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir gunicorn

# Copy backend files
COPY . .

# Expose port
EXPOSE 5000

# Start server using gunicorn WSGI
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "run:app"]
