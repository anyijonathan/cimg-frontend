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

  }
}