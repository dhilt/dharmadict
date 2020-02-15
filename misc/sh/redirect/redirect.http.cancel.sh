#!/bin/sh
iptables -t nat -D PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000
