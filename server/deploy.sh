#! /usr/bin/env bash
openssl aes-256-cbc -K $encrypted_539d231ab808_key -iv $encrypted_539d231ab808_iv -in .travis/muffin.enc -out .travis/muffin -d
chmod 600 .travis/muffin
eval "$(ssh-agent -s)" # start the ssh agent
ssh-add .travis/muffin
git remote add deploy $deploy_user@$deploy_host:$deploy_uri
git push deploy master
