#!/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

CHECK_SCRIPT_PATH="/usr/local/bin/database/database.check.sh"
SETUP_SCRIPT_PATH="/usr/local/bin/database/database.start.sh"
if (( "$CHECK_SCRIPT_PATH" ));
then 
  echo "Nothing to do";
else
  "$SETUP_SCRIPT_PATH"
  "$CHECK_SCRIPT_PATH"
  echo "Database service had been started";
fi
