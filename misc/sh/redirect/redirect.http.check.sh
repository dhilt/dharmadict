#!/bin/sh
iptables -t nat -vnL | grep REDIRECT | grep 3000
