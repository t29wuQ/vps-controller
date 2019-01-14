#!/bin/sh

. ~/vps-controller/routes/main/config/server

ssh -i $secretkey $server $1