#!/bin/sh

if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]
then

  if [ "$TRAVIS_BRANCH" == "staging" ]
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
        return 0
      else
        echo "Failed to register task definition"
        return 1
      fi
    }

    # new
    update_service() {
      if [[ $(aws ecs update-service --cluster $cluster --service $service --task-definition $revision | $JQ '.service.taskDefinition') != $revision ]]; then
        echo "Error updating service."
        return 1
      else
        return 0
      fi
      
    }

    deploy_cluster() {

      # new
      cluster="test-driven-staging-cluster"

      # users
      # new
      service="testdriven-users-stage-service"
      template="ecs_users_stage_taskdefinition.json"
      task_template=$(cat "ecs/$template")
      task_def=$(printf "$task_template" $AWS_ACCOUNT_ID $AWS_ACCOUNT_ID)
      echo "$task_def"

      if [[ register_definition ]]; then 
        echo "register_definition was successfull for template: $template"
      else 
        echo "register_definition failed for template: $template"
      fi

      if [[ update_service ]]; then 
        echo "update_service was successfull for service: $service"
      else 
        echo "update_service failed for service: $service"
      fi
      

      # client
      # new
      service="testdriven-client-stage-service"
      template="ecs_client_stage_taskdefinition.json"
      task_template=$(cat "ecs/$template")
      task_def=$(printf "$task_template" $AWS_ACCOUNT_ID)
      echo "$task_def"

      if [[ register_definition ]]; then 
        echo "register_definition was successfull for template: $template"
      else 
        echo "register_definition failed for template: $template"
      fi

      if [[ update_service ]]; then 
        echo "update_service was successfull for service: $service"
      else 
        echo "update_service failed for service: $service"
      fi

      # register_definition
      # # new
      # update_service

      # swagger
      # new
      service="testdriven-swagger-stage-service"
      template="ecs_swagger_stage_taskdefinition.json"
      task_template=$(cat "ecs/$template")
      task_def=$(printf "$task_template" $AWS_ACCOUNT_ID)
      echo "$task_def"

      if [[ register_definition ]]; then 
        echo "register_definition was successfull for template: $template"
      else 
        echo "register_definition failed for template: $template"
      fi

      if [[ update_service ]]; then 
        echo "update_service was successfull for service: $service"
      else 
        echo "update_service failed for service: $service"
      fi

      # register_definition
      # # new
      # update_service


    }

    configure_aws_cli
    deploy_cluster

  fi

fi