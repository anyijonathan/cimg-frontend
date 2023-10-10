pipeline {
  agent any
  stages {
    stage('checkout from Github') {
      steps {
        git(url: 'https://github.com/anyijonathan/cimg-frontend.git', branch: 'master')
      }
    }

    stage('build docker image') {
      steps {
        sh 'docker build -t cimg-frontend .'
      }
    }

    stage('Dockerhub Login') {
      environment {
        DOCKERHUB_PASSWORD = 'Jonathan10.'
        DOCKERHUB_USER = 'anyijonathan'
      }
      steps {
        sh '''echo "Jonathan10." | docker login -u anyijonathan --password-stdin
'''
      }
    }

    stage('push image to dockerHub') {
      steps {
        sh 'docker push anyijonathan/cimg_frontend:latest'
      }
    }

  }
}