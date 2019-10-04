#!/bin/bash
wget https://dl.eff.org/certbot-auto
chmod a+x ./certbot-auto
mv ./certbot-auto /usr/bin
DEBIAN_FRONTEND=noninteractive certbot-auto --os-packages-only -n