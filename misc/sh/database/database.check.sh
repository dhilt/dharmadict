#!/bin/sh
service --status-all 2>&1 | grep elasticsearch | grep +
