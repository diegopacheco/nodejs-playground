#!/bin/bash

docker pull postgres
docker run --rm -itd -e POSTGRES_USER=root -e \
 POSTGRES_PASSWORD=root -p 5432:5432 \
 -v ./data:/var/lib/postgresql/data \
 --name postgresql postgres
