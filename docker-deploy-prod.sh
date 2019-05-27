#!/bin/sh

echo "docker-deploy-prod bash script is now executing"
echo "docker-deploy-prod 'pwd' is .. $(pwd)"
echo "docker-deploy-prod 'ls -al' is .. $(ls -al)"
echo "docker-deploy-prod 'ls -al ecs' is .. $(ls -al ecs)"

if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]
then

  if [ "$TRAVIS_BRANCH" == "production" ]
  then

    JQ="jq --raw-output --exit-status"

    configure_aws_cli() {
        aws --version
        aws configure set default.region us-west-1
        aws configure set default.output json
        echo "AWS Configured!"
    }

    register_definition() {
      if revision=$(aws ecs register-task-definition --cli-input-json "$task_def" | $JQ '.taskDefinition.taskDefinitionArn'); then
        echo "Revision: $revision"
      else
        echo "Failed to register task definition"
        return
      fi
    }

    deploy_cluster() {


      # users
      template="ecs_users_prod_taskdefinition.json"
      task_template=$(cat "ecs/$template")
      task_def=$(printf "$task_template" $AWS_ACCOUNT_ID $AWS_RDS_URI $PRODUCTION_SECRET_KEY)
      echo "$task_def"
      register_definition
      status=$?
      if ! $(exit $status); then
        echo "register_definition failed."
        echo "dumping current value of template: $template"
      fi

      # client
      template="ecs_client_prod_taskdefinition.json"
      task_template=$(cat "ecs/$template")
      task_def=$(printf "$task_template" $AWS_ACCOUNT_ID)
      echo "$task_def"
      register_definition
      status=$?
      if ! $(exit $status); then
        echo "register_definition failed."
        echo "dumping current value of template: $template"
      fi

      # swagger
      service="testdriven-swagger-prod-service"
      template="ecs_swagger_prod_taskdefinition.json"
      task_template=$(cat "ecs/$template")
      task_def=$(printf "$task_template" $AWS_ACCOUNT_ID)
      echo "$task_def"
      register_definition
      status=$?
      if ! $(exit $status); then
        echo "register_definition failed."
        echo "dumping current value of template: $template"
      fi

    }

    configure_aws_cli
    deploy_cluster

  fi

fi