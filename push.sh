#!/bin/bash
git push origin `git subtree split --prefix publish master`:gh-pages
