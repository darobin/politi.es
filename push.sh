#!/bin/bash
# git push origin `git subtree split --prefix publish master`:gh-pages
# git subtree push --prefix publish origin gh-pages
GIT_DEPLOY_DIR=publish ./deploy.sh
