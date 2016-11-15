#!/bin/bash
# git push origin `git subtree split --prefix publish master`:gh-pages
git subtree push --prefix publish origin gh-pages
# try this one if the above doesn't work
#   cd ./out && \
#   remote_repo=`git config remote.origin.url` && \
#   remote_branch="gh-pages" && \
#   git init && \
#   git add . && \
#   git commit -m'build' && \
#   git push $remote_repo master:$remote_branch --force && \
#   rm -fr .git && \
#   cd ../
