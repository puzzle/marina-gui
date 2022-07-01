pipeline {
  agent { label 'buildnode-cloud' }
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
    timeout(time: 10, unit: 'MINUTES')
    timestamps()
    ansiColor('xterm')
  }
  triggers {
    pollSCM('H/5 * * * *')
  }
  parameters {
    string(name: 'build_project', defaultValue: 'pitc-marina-build', description: 'The OpenShift Build Project')
    string(name: 'dev_project', defaultValue: 'pitc-marina-dev', description: 'The OpenShift Dev Project')
    string(name: 'test_project', defaultValue: 'pitc-marina-test', description: 'The OpenShift Test Project')
    string(name: 'prod_project', defaultValue: 'pitc-marina-prod', description: 'The OpenShift Prod Project')

    string(name: 'openshift_cluster', defaultValue: 'OpenShift4CloudscaleProduction', description: 'The OpenShift Cluster')
    string(name: 'openshift_cluster_token', defaultValue: 'ocp4-cloudscale-synced_pitc-marina-build_cicd-deployer', description: 'The OpenShift Cluster')
  }
  environment {
    OC_TOKEN=credentials("${params.openshift_cluster_token}")
    OC_HOME=tool('oc')
    NVM_HOME = tool('nvm')
    YARN_HOME = tool('yarn')
    PATH = "${OC_HOME}/bin:$YARN_HOME/bin:node_modules/.bin:$PATH"
  }
  stages {
    stage('Build') {
      steps {
        sh """#!/bin/bash +x
             source \${HOME}/.nvm/nvm.sh
             nvm install 8.11.3
             nvm use --delete-prefix v8.11.3
             which node
             node --version
             which yarn
             yarn --version

             yarn install
             CI=true yarn test --coverage
             NODE_ENV=production yarn build
           """
      }
    }
    stage('Build Docker Image') {
      steps {
        script {
          openshift.withCluster("${params.openshift_cluster}") {
            openshift.withCredentials(env.OC_TOKEN) {
              openshift.withProject("${params.build_project}") {
                echo "Running in project: ${openshift.project()}"
                def buildSelector = openshift.startBuild("marina-gui")
                buildSelector.logs('-f')
              }
            }
          }
        }
      }
    }
    stage('Deploy to Dev') {
      steps {
        script {
          openshift.withCluster("${params.openshift_cluster}") {
            openshift.withCredentials(env.OC_TOKEN) {
              openshift.withProject("${params.build_project}") {
                echo "Tagging dev, Project: ${openshift.project()}"
                def tagSelector = openshift.tag("${params.build_project}/marina-gui:latest", "${params.build_project}/marina-gui:dev")

              }
              openshift.withProject("${params.dev_project}") {
                echo "Deploying to dev, Project: ${openshift.project()}"
                def dc = openshift.selector("dc/marina-gui");
                dc.rollout().latest()
                dc.rollout().status()  //Wait for deployment to complete
              }
            }
          }
        }
      }
    }
    stage('Integration Tests Dev') {
      steps {
        echo "Executing integration tests"
      }
    }
    stage('Deploy to Test') {
      steps {
        script {
          openshift.withCluster("${params.openshift_cluster}") {
            openshift.withCredentials(env.OC_TOKEN) {
              openshift.withProject("${params.build_project}") {
                echo "Tagging dev, Project: ${openshift.project()}"
                def tagSelector = openshift.tag("${params.build_project}/marina-gui:dev", "pitc-marina-build/marina-gui:test")

              }
              openshift.withProject("${params.test_project}") {
                echo "Deploying to test, Project: ${openshift.project()}"
                def dc = openshift.selector("dc/marina-gui");
                dc.rollout().latest()
                dc.rollout().status()  //Wait for deployment to complete
              }
            }
          }
        }
      }
    }
    stage('Integration Tests Test') {
      steps {
        echo "Executing integration tests"
      }
    }
    stage('Deploy to Prod') {
      when {
            // Only on master branch
            expression { env.BRANCH_NAME == 'master' }
      }
      steps {
        script {
          openshift.withCluster("${params.openshift_cluster}") {
            openshift.withCredentials(env.OC_TOKEN) {
              openshift.withProject("${params.build_project}") {
                echo "Tagging dev, Project: ${openshift.project()}"
                def tagSelector = openshift.tag("${params.build_project}/marina-gui:test", "pitc-marina-build/marina-gui:prod")

              }
              openshift.withProject("${params.prod_project}") {
                echo "Deploying to prod, Project: ${openshift.project()}"
                def dc = openshift.selector("dc/marina-gui");
                dc.rollout().latest()
                dc.rollout().status()  //Wait for deployment to complete
              }
            }
          }
        }
      }
    }
  }
  post {
    success {
      rocketSend avatar: 'https://chat.puzzle.ch/emoji-custom/success.png', channel: 'pitc-marina', message: "Deployment success - Branch ${env.BRANCH_NAME} - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)", rawMessage: true
    }
    unstable {
      rocketSend avatar: 'https://chat.puzzle.ch/emoji-custom/unstable.png', channel: 'pitc-marina', message: "Deployment unstable - Branch ${env.BRANCH_NAME} - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)", rawMessage: true
    }
    failure {
      rocketSend avatar: 'https://chat.puzzle.ch/emoji-custom/failure.png', channel: 'pitc-marina', message: "Deployment failure - Branch ${env.BRANCH_NAME} - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)", rawMessage: true
    }
  }
}
