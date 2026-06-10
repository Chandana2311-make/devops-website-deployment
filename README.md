# 🚀 Automated Website Deployment — Jenkins + Ansible

**Complete DevOps Mini Project** | CI/CD Pipeline | Industry-Level

---

## 📁 Project Structure

```
devops-project/
├── 📄 README.md                    ← You are here
├── 📄 Jenkinsfile                  ← Pipeline definition (Pipeline job)
├── 📄 Dockerfile                   ← Optional Docker containerization
├── 📄 docker-compose.yml           ← Optional multi-container setup
│
├── 🌐 website/                     ← The actual website to deploy
│   ├── index.html                  ← Main HTML page
│   ├── css/
│   │   └── style.css               ← Responsive CSS styles
│   └── js/
│       └── main.js                 ← JavaScript interactions
│
├── ⚙️  ansible/                     ← All Ansible automation files
│   ├── deploy.yml                  ← MAIN deployment playbook ⭐
│   ├── inventory.ini               ← Server IP addresses
│   ├── ansible.cfg                 ← Ansible configuration
│   ├── rollback.yml                ← Rollback to previous version
│   ├── docker-deploy.yml           ← Optional Docker deployment
│   └── group_vars/
│       └── webservers.yml          ← Variables for web servers
│
└── 📚 docs/
    ├── INSTALLATION_GUIDE.txt      ← Step-by-step setup (START HERE)
    ├── TROUBLESHOOTING.txt         ← Fix common problems
    ├── VIVA_QA.txt                 ← Viva questions & answers
    └── PROJECT_REPORT_FORMAT.txt   ← Report writing template
```

---

## ⚡ Quick Start (5 Steps)

### Step 1 — Edit inventory.ini with your server IP
```ini
[webservers]
webserver1 ansible_host=YOUR_SERVER_IP ansible_user=ubuntu \
  ansible_ssh_private_key_file=~/.ssh/id_rsa
```

### Step 2 — Edit Jenkinsfile with your GitHub URL
```groovy
REPO_URL = 'https://github.com/YOUR_USERNAME/YOUR_REPO.git'
DEPLOY_HOST = 'YOUR_SERVER_IP'
```

### Step 3 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial DevOps project setup"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 4 — Setup GitHub Webhook
```
GitHub → Repo → Settings → Webhooks → Add webhook
Payload URL: http://JENKINS_IP:8080/github-webhook/
Content type: application/json
Events: Push events ✅
```

### Step 5 — Create Jenkins Job
```
Jenkins → New Item → Pipeline
Pipeline script from SCM → Git → your repo URL
Script Path: Jenkinsfile → Save → Build Now
```

---

## 🔧 Key Commands Reference

```bash
# Test Ansible can reach servers
ansible webservers -i ansible/inventory.ini -m ping

# Run deployment manually (without Jenkins)
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml -v

# Dry-run (don't actually change anything)
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml --check

# Rollback to previous deployment
ansible-playbook -i ansible/inventory.ini ansible/rollback.yml

# Docker build and run (optional)
docker build -t devops-website .
docker run -d -p 80:80 devops-website

# Check Jenkins service
sudo systemctl status jenkins

# View Jenkins logs
sudo journalctl -u jenkins -f
```

---

## 🌐 Deployment Environments

| Environment | Change in inventory.ini | Notes |
|-------------|------------------------|-------|
| Local VM (VirtualBox) | `ansible_host=192.168.x.x` | Private IP |
| AWS EC2 | `ansible_host=54.x.x.x` + `ansible_ssh_private_key_file=~/.ssh/key.pem` | Public IP |
| Azure VM | `ansible_host=40.x.x.x` + `ansible_user=azureuser` | Public IP |

---

## 📊 Pipeline Stages

```
[Checkout] → [Validate] → [Test] → [Deploy] → [Verify]
   ↓              ↓           ↓         ↓           ↓
 git pull    HTML check   dry-run   ansible     HTTP 200
             YAML lint    ansible   playbook     check
```

---

## 📚 Read These Docs (in order)

1. `docs/INSTALLATION_GUIDE.txt` — Full setup from scratch
2. `docs/TROUBLESHOOTING.txt` — When things go wrong  
3. `docs/VIVA_QA.txt` — 18 viva questions with detailed answers
4. `docs/PROJECT_REPORT_FORMAT.txt` — Report template + screenshot guide

---

## 🔑 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Ubuntu | 22.04 LTS | Host OS |
| Jenkins | Latest LTS | CI/CD Server |
| Ansible | 2.14+ | Deployment Automation |
| Apache2 | 2.4+ | Web Server |
| Git | 2.x | Version Control |
| GitHub | — | Repository + Webhooks |
| Docker | 24+ | Optional Containerization |

---

## 📝 Expected Workflow

```
Developer → git push → GitHub → Webhook → Jenkins → Ansible → Apache → 🌐 Live!
```

Total time: **under 60 seconds** from push to live website.

---

*DevOps Mini Project | Computer Science & Engineering | 2024–25*
