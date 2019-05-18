#!/bin/bash
# @1: program to launch
#  - app
#  - black
#  - everloop
#  - gpio
#  - humidity
#  - imu
#  - pressure
#  - servo
#  - stt
#  - tts
#  - uv
#  - wakeword
# @2: "loop" - optionnally - to keep permanent execution

# Constantes definition
node=/usr/bin/node
sig_file=/tmp/matrix_${1}.sig
pid_file=/tmp/matrix_${1}.pid

# Stop execution based on pid file, given as first parameter, witch contains the pid number
stop_run(){
  if [ -f ${1} ]; then
    kill -9 `cat ${1}` 
    rm -f ${1}
  fi
}

# Check if stop is necessary
stop_run ${pid_file}

# Launch new execution
cd `dirname ${0}`
node ${1}.js | grep 'port_data_update' | awk -F'=' '{print $2}' | grep '^{' > ${sig_file} &

# Record the pid node number
ps aux | grep ${1} | grep node | awk '{print $2}' > ${pid_file}

# If loop not requested stop the node process
if [ "${2}" != "loop" ]; then
  sleep 2
  stop_run ${pid_file}
fi

# This is the End...
exit 0
