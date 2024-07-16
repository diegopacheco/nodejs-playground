#!/bin/bash

docker pull dpage/pgadmin4:latest
docker run --name pgadmin-root \
 -p 5051:80 -e "PGADMIN_DEFAULT_EMAIL=user@pg.pgm" \
 -e "PGADMIN_DEFAULT_PASSWORD=root" \
 -d dpage/pgadmin4