#!/bin/bash
lsof -ti:3000 | xargs kill -9 2>/dev/null
echo "Gramado 3D stopped."
