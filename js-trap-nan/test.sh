#!/bin/bash

source ~/.nvm/nvm.sh

for i in {16..23}
do
    nvm install $i
    nvm use $i
    node index.js
done