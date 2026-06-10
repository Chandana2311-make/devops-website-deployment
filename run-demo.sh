#!/bin/bash

echo "Starting Apache..."
sudo service apache2 start

echo "Starting SSH..."
sudo service ssh start

echo "Running Ansible Deployment..."
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml -e "build_number=1 deploy_time='2026-06-10'"

echo "Deployment Complete!"
echo "Open: http://localhost"