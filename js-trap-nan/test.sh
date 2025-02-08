#!/bin/bash

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

for i in {16..23}
do
    nvm install $i
    nvm use $i
    echo "Running index.js with Node.js version $i..."
    echo "Node Version: $(node -v)"
    node index.js
done