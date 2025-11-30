# Use Python 3.11 as base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements file
COPY Backend/requirements.txt Backend/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r Backend/requirements.txt

# Copy application files
COPY Backend/ Backend/
COPY Frontend/ Frontend/
COPY Database/ Database/

# Create data directory for JSON storage
RUN mkdir -p Backend/data

# Expose port
EXPOSE 5000

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=5000

# Change to Backend directory and run the application
WORKDIR /app/Backend

# Run the Flask application
CMD ["python", "app.py"]
