# Use Python 3.11 as base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements file
COPY Backend/requirements.txt ./requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY Backend/ ./
COPY Frontend/ ../Frontend/
COPY Database/ ../Database/

# Create data directory for JSON storage
RUN mkdir -p data

# Expose port
EXPOSE 5000

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=5000

# Run the Flask application
CMD ["python", "app.py"]
