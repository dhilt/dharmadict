#!/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

declare -a array=(
"/usr/local/bin/redirect/redirect.http.sh"
"/usr/local/bin/database/database.sh"
)

for i in "${array[@]}"
do
   "$i"
done
