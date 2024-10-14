# Use the official PostgreSQL image from the Docker Hub
FROM postgres:latest

# Set environment variables for PostgreSQL
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=time_tracker_dev

# Expose the default PostgreSQL port
EXPOSE 5432

# Add any custom initialization scripts if needed
# COPY init.sql /docker-entrypoint-initdb.d/

# Default command to run PostgreSQL
CMD ["postgres"]