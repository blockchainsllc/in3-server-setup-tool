#!/bin/sh

# remove existing docker installations
apt remove -y docker docker-engine docker.io

# install dependencies
apt install -y apt-transport-https ca-certificates curl software-properties-common

# add the docker gpg key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

# add the stable Docker repository
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# update the sources
apt update

# install docker-ce
apt install docker-ce

# add your limited Linux user account to the docker group
usermod -aG docker $USER

# install docker-compose
curl -L https://github.com/docker/compose/releases/download/1.18.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

# set the right permissions
sudo chmod +x /usr/local/bin/docker-compose




