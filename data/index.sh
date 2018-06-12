#! /bin/bash

# Create the blog database if it doesn't exist
mysql --user="root" --execute="CREATE DATABASE IF NOT EXISTS blog;"

# Fill blog database
HOST=localhost node users.js
HOST=localhost node comments.js
HOST=localhost node characters.js
