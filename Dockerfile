# ============================================================
#  Dockerfile — Containerized Website Deployment (Optional)
#  Build : docker build -t devops-website .
#  Run   : docker run -d -p 80:80 devops-website
# ============================================================

# Use official Apache image as base
FROM httpd:2.4-alpine

# Set maintainer label
LABEL maintainer="DevOps Mini Project"
LABEL description="Automated CI/CD Website Deployment"
LABEL version="1.0"

# Copy website files into Apache's web root
COPY website/ /usr/local/apache2/htdocs/

# Copy custom Apache config (optional)
# COPY docker/httpd.conf /usr/local/apache2/conf/httpd.conf

# Expose port 80
EXPOSE 80

# Apache starts automatically as CMD in base image
# Override if needed:
# CMD ["httpd-foreground"]
