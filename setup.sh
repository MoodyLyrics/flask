#!/bin/bash
CURRENT=${PWD}

npm install
echo "NPM INSTALL SUCCESS"
bower install
echo "BOWER INSTALL SUCCESS"
pip install -r $CURRENT/requirements.txt
echo "PIP INSTALL SUCCESS"
