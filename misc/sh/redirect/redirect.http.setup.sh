#!/bin/sh
iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000
