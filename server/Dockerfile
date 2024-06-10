# Use the official slim version of Python 3.9 as the base image
FROM python:3.9-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy the requirements.txt file into the container
COPY requirements.txt .

# Install system dependencies for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install the Python dependencies specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy all the files from the current directory to the container's working directory
COPY . .

# Expose port 6969 to allow communication to/from the container
EXPOSE 6969

# Command to run the application
CMD ["python", "main.py"]
