#!/bin/bash
meteor create --minimal testapp
cd testapp
mkdir packages && mkdir packages/meteor-api-keys
cp ../* packages/meteor-api-keys
meteor add bratelefant:meteor-api-keys
meteor npm install --save simpl-schema
cd packages/meteor-api-keys
meteor npm install
meteor npm run test
cd ../../..
rm -rf testapp