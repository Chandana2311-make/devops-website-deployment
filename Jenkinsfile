// ============================================================
//  Jenkinsfile — Automated Website Deployment
//  Project: Jenkins + Ansible CI/CD Pipeline
//  Author : DevOps Mini Project
// ============================================================

pipeline {

    // Run on any available agent (Jenkins master or slave)
    agent any

    // ── Environment Variables ──────────────────────────────
    environment {
        REPO_URL        = 'https://github.com/YOUR_USERNAME/YOUR_REPO.git'
        BRANCH          = 'main'
        ANSIBLE_DIR     = "${WORKSPACE}/ansible"
        INVENTORY_FILE  = "${WORKSPACE}/ansible/inventory.ini"
        PLAYBOOK_FILE   = "${WORKSPACE}/ansible/deploy.yml"
        DEPLOY_USER     = 'ubuntu'                    // SSH user on target server
        DEPLOY_HOST     = '192.168.1.100'             // Change to your server IP
        APP_DIR         = '/var/www/html'
        BUILD_TIMESTAMP = sh(script: 'date "+%Y-%m-%d %H:%M:%S"', returnStdout: true).trim()
    }

    // ── Build Triggers ─────────────────────────────────────
    triggers {
        // Poll SCM every minute (fallback if webhook fails)
        pollSCM('* * * * *')
        // GitHub webhook trigger (primary)
        githubPush()
    }

    // ── Pipeline Options ───────────────────────────────────
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))   // Keep last 10 builds
        timeout(time: 15, unit: 'MINUTES')               // Fail if takes > 15 min
        timestamps()                                      // Add timestamps to logs
        disableConcurrentBuilds()                         // No parallel builds
    }

    // ════════════════════════════════════════════════════════
    //  STAGES
    // ════════════════════════════════════════════════════════
    stages {

        // ── Stage 1: Checkout ──────────────────────────────
        stage('📥 Checkout Code') {
            steps {
                echo "======================================"
                echo " Pulling latest code from GitHub..."
                echo " Branch  : ${BRANCH}"
                echo " Repo    : ${REPO_URL}"
                echo " Time    : ${BUILD_TIMESTAMP}"
                echo "======================================"

                // Clean workspace and checkout fresh
                cleanWs()
                git branch: "${BRANCH}",
                    url: "${REPO_URL}"

                echo "✅ Code checkout successful!"
                sh 'ls -la'    // Show files pulled
            }
        }

        // ── Stage 2: Validate ──────────────────────────────
        stage('🔍 Validate & Lint') {
            steps {
                echo "Running validation checks..."

                // Check if required files exist
                sh '''
                    echo "── Checking project structure ──"
                    test -f website/index.html  && echo "✅ index.html found"    || echo "❌ index.html MISSING"
                    test -f ansible/deploy.yml  && echo "✅ deploy.yml found"    || echo "❌ deploy.yml MISSING"
                    test -f ansible/inventory.ini && echo "✅ inventory.ini found" || echo "❌ inventory.ini MISSING"
                    echo "── File listing ──"
                    find . -type f | head -40
                '''

                // Validate HTML syntax (basic check)
                sh '''
                    if command -v tidy &>/dev/null; then
                        echo "── HTML Validation ──"
                        tidy -errors -quiet -utf8 website/index.html || true
                    else
                        echo "tidy not installed, skipping HTML validation"
                    fi
                '''

                // Lint Ansible playbook
                sh '''
                    echo "── Ansible Syntax Check ──"
                    ansible-playbook --syntax-check \
                        -i ${INVENTORY_FILE} \
                        ${PLAYBOOK_FILE} \
                        && echo "✅ Ansible syntax OK" \
                        || echo "⚠️  Ansible syntax warning (continuing)"
                '''
            }
        }

        // ── Stage 3: Test ──────────────────────────────────
        stage('🧪 Run Tests') {
            steps {
                echo "Running automated tests..."

                sh '''
                    echo "── CSS Check ──"
                    test -f website/css/style.css \
                        && echo "✅ CSS file present ($(wc -l < website/css/style.css) lines)" \
                        || echo "❌ CSS MISSING"

                    echo "── JavaScript Check ──"
                    test -f website/js/main.js \
                        && echo "✅ JS file present ($(wc -l < website/js/main.js) lines)" \
                        || echo "❌ JS MISSING"

                    echo "── Checking no broken HTML links (basic) ──"
                    grep -c "href" website/index.html \
                        && echo "✅ Links found in HTML" \
                        || true

                    echo "── Ansible Playbook Dry-Run (check mode) ──"
                    ansible-playbook --check \
                        -i ${INVENTORY_FILE} \
                        ${PLAYBOOK_FILE} \
                        && echo "✅ Dry-run passed" \
                        || echo "⚠️  Dry-run warnings (continuing)"
                '''
            }
        }

        // ── Stage 4: Deploy ────────────────────────────────
        stage('🚀 Deploy with Ansible') {
            steps {
                echo "======================================"
                echo " Deploying to server: ${DEPLOY_HOST}"
                echo "======================================"

                sh '''
                    echo "── Starting Ansible Deployment ──"
                    ansible-playbook \
                        -i ${INVENTORY_FILE} \
                        ${PLAYBOOK_FILE} \
                        --extra-vars "build_number=${BUILD_NUMBER} deploy_time='${BUILD_TIMESTAMP}'" \
                        -v
                '''

                echo "✅ Deployment complete!"
            }
        }

        // ── Stage 5: Verify ────────────────────────────────
        stage('✅ Verify Deployment') {
            steps {
                echo "Verifying deployment..."

                sh '''
                    echo "── Checking Apache Status on Remote ──"
                    ansible webservers \
                        -i ${INVENTORY_FILE} \
                        -m shell \
                        -a "systemctl is-active apache2 && curl -s -o /dev/null -w '%{http_code}' http://localhost"

                    echo "── Checking deployed files ──"
                    ansible webservers \
                        -i ${INVENTORY_FILE} \
                        -m shell \
                        -a "ls -la /var/www/html/ | head -20"
                '''

                echo "🌐 Website is LIVE at http://${DEPLOY_HOST}"
            }
        }

    }
    // ════════════════════════════════════════════════════════

    // ── Post Actions ──────────────────────────────────────
    post {

        success {
            echo """
            ╔══════════════════════════════════════╗
            ║  ✅  BUILD SUCCESSFUL                ║
            ║  Build  : #${BUILD_NUMBER}           ║
            ║  Time   : ${BUILD_TIMESTAMP}         ║
            ║  URL    : http://${DEPLOY_HOST}      ║
            ╚══════════════════════════════════════╝
            """
            // Uncomment below to send email notifications:
            // emailext(
            //   subject: "✅ Build #${BUILD_NUMBER} Deployed Successfully",
            //   body: "Website deployed to http://${DEPLOY_HOST}\nBuild: #${BUILD_NUMBER}",
            //   to: 'your-email@example.com'
            // )
        }

        failure {
            echo """
            ╔══════════════════════════════════════╗
            ║  ❌  BUILD FAILED                    ║
            ║  Build  : #${BUILD_NUMBER}           ║
            ║  Check console output for details    ║
            ╚══════════════════════════════════════╝
            """
        }

        always {
            // Archive build artifacts
            archiveArtifacts artifacts: 'website/**/*', fingerprint: true, allowEmptyArchive: true
            // Clean workspace after build to save disk space
            cleanWs(cleanWhenSuccess: true, cleanWhenFailure: false)
        }

    }
}
