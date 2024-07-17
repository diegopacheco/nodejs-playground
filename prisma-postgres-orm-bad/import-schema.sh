#!/bin/bash

docker exec -it postgresql psql -U root -c "CREATE DATABASE db;"
cat dump.sql | docker exec -i postgresql psql -U root