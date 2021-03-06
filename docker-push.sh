#!/bin/sh

echo TRAVIS_PULL_REQUEST:$TRAVIS_PULL_REQUEST
echo TRAVIS_BRANCH:$TRAVIS_BRANCH

if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]
then

  if [[ "$TRAVIS_BRANCH" == "staging" ]]; then
    export DOCKER_ENV=stage
    export REACT_APP_USERS_SERVICE_URL="http://testdriven-staging-alb-1457912982.us-west-1.elb.amazonaws.com"
  elif [[ "$TRAVIS_BRANCH" == "production" ]]; then
     export DOCKER_ENV=prod
     export REACT_APP_USERS_SERVICE_URL="http://testdriven-production-alb-1863924933.us-west-1.elb.amazonaws.com"
     export DATABASE_URL="$AWS_RDI_URI"
     export SECRET_KEY="$PRODUCTION_SECRET_KEY"
  fi
    curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
    unzip awscli-bundle.zip
    ./awscli-bundle/install -b ~/bin/aws
    export PATH=~/bin:$PATH
    # add AWS_ACCOUNT_ID, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY env vars
    eval $(aws ecr get-login --region us-west-1 --no-include-email)
    export TAG=$TRAVIS_BRANCH
    export REPO=$AWS_ACCOUNT_ID.dkr.ecr.us-west-1.amazonaws.com
  fi

  if [[ "$TRAVIS_BRANCH" == "staging" ]]; then
    # users
    docker build $USERS_REPO -t $USERS:$COMMIT -f Dockerfile-$DOCKER_ENV
    docker tag $USERS:$COMMIT $REPO/$USERS:$TAG
    docker push $REPO/$USERS:$TAG
    # users db
    docker build $USERS_DB_REPO -t $USERS_DB:$COMMIT -f Dockerfile
    docker tag $USERS_DB:$COMMIT $REPO/$USERS_DB:$TAG
    docker push $REPO/$USERS_DB:$TAG
    # client
    # docker build $CLIENT_REPO -t $CLIENT:$COMMIT -f Dockerfile-prod --build-arg REACT_APP_USERS_SERVICE_URL=TBD
    docker build $CLIENT_REPO -t $CLIENT:$COMMIT -f Dockerfile-$DOCKER_ENV --build-arg REACT_APP_USERS_SERVICE_URL=$REACT_APP_USERS_SERVICE_URL
    docker tag $CLIENT:$COMMIT $REPO/$CLIENT:$TAG
    docker push $REPO/$CLIENT:$TAG
    # swagger
    docker build $SWAGGER_REPO -t $SWAGGER:$COMMIT -f Dockerfile-$DOCKER_ENV
    docker tag $SWAGGER:$COMMIT $REPO/$SWAGGER:$TAG
    docker push $REPO/$SWAGGER:$TAG

  elif [[ "$TRAVIS_BRANCH" == "production" ]]; then
    # users
    docker build $USERS_REPO -t $USERS:$COMMIT -f Dockerfile-$DOCKER_ENV
    docker tag $USERS:$COMMIT $REPO/$USERS:$TAG
    docker push $REPO/$USERS:$TAG
    # users db
    # production uses Amazon RDS
    # client
    docker build $CLIENT_REPO -t $CLIENT:$COMMIT -f Dockerfile-$DOCKER_ENV --build-arg REACT_APP_USERS_SERVICE_URL=$REACT_APP_USERS_SERVICE_URL
    docker tag $CLIENT:$COMMIT $REPO/$CLIENT:$TAG
    docker push $REPO/$CLIENT:$TAG
    # swagger
    docker build $SWAGGER_REPO -t $SWAGGER:$COMMIT -f Dockerfile-$DOCKER_ENV
    docker tag $SWAGGER:$COMMIT $REPO/$SWAGGER:$TAG
    docker push $REPO/$SWAGGER:$TAG
  fi
fi