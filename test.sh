#!/bin/bash


type=$1
fails=""

inspect() {
  if [ $1 -ne 0 ]; then
    fails="${fails} $2"
  fi
}

# run server-side tests
server() {
  docker-compose -f docker-compose-dev.yml up -d --build
  docker-compose -f docker-compose-dev.yml exec users python manage.py test
  inspect $? users
  docker-compose -f docker-compose-dev.yml exec users flake8 project
  inspect $? users-lint
  docker-compose -f docker-compose-dev.yml down
}

# run client-side tests
client() {
  docker-compose -f docker-compose-dev.yml up -d --build
  docker-compose -f docker-compose-dev.yml exec client npm test -- --coverage
  inspect $? client
  docker-compose -f docker-compose-dev.yml down
}

# run e2e tests
e2e() {
  docker-compose -f docker-compose-prod.yml up -d --build
  docker-compose -f docker-compose-prod.yml exec users python manage.py recreate_db
  ./node_modules/.bin/cypress run --config baseUrl=http://localhost
  inspect $? e2e
  docker-compose -f docker-compose-prod.yml down
}

# run all tests
all() {
  docker-compose -f docker-compose-dev.yml up -d --build
  docker-compose -f docker-compose-dev.yml exec users python manage.py test
  inspect $? users
  docker-compose -f docker-compose-dev.yml exec users flake8 project
  inspect $? users-lint
  docker-compose -f docker-compose-dev.yml exec client npm test -- --coverage
  inspect $? client
  docker-compose -f docker-compose-dev.yml down
  e2e
}

# run appropriate tests
if [[ "${type}" == "server" ]]; then
  printf "\n"
  printf "Running server-side tests!\n"
  server
elif [[ "${type}" == "client" ]]; then
  printf "\n"
  printf "Running client-side tests!\n"
  client
elif [[ "${type}" == "e2e" ]]; then
  printf "\n"
  printf "Running e2e tests!\n"
  e2e
else
  printf "\n"
  printf "Running all tests!\n"
  all
fi

# return proper code
if [ -n "${fails}" ]; then
  printf "\n"
  printf "Tests failed: ${fails}"
  exit 1
else
  printf "\n"
  printf "Tests passed!"
  exit 0
fi