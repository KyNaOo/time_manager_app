#!/bin/bash

delete_all() {
    docker network rm $(docker network ls -q)
    docker rm -v -f $(docker ps -qa)
    docker rmi -f $(docker images -q)
}

create_network() {
    docker network create --driver bridge backend
    docker network create --driver bridge frontend
}

do_database() {
    image=$1
    name=$2
    docker build -t postgres .
    docker run --name database --network=back -d postgres
}

do_backend() {
    image=$1
    name=$2
    docker build -t elixir ./back/
    docker run --name backend --network=back --network=front -p 4000:4000 -d elixir
}

do_frontend() {
    image=$1
    name=$2
    docker build -t vuejs ./front/
    docker run --name frontend --network=front -p 5173:5173 -d vuejs
}


enter_container() {
    $container = $1
    docker exec -it $container bash
    #docker exec -it $container sh
}

start_container() {
    $container = $1
    docker start $container
    #docker start -a -i $(docker ps -q -l)
}

connect_network() {
    docker network connect back database

    docker network connect back backend
    docker network connect front backend

    docker network connect front frontend
}

install_test_tool() {
    apt upgrade -y && apt update -y
    apt-get install -y iputils-ping
    apt-get install -y postgresql-client
    apt-get install -y lsof
    #psql -h database -p 5432 -U postgres time_tracker_dev
}

#container_process() {
    #lsof -i :<PORT>
    #kill -9 <PID>
#}

do_all() {
    delete_all
    create_network
    do_database
    do_backend
    do_frontend
}

#do_all
delete_all
#create_network
#do_database