#!/bin/bash

source ~/.nvm/nvm.sh

for i in {23..23} 
do
    nvm use node $i
    node index.js
done