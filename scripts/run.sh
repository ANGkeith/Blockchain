#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset
script_directory=$(cd $(dirname ${BASH_SOURCE}) && pwd -P)
project_root=$(cd $(dirname ${script_directory}) && pwd -P)

xhost +local:"${USER}"
export UID

docker-compose up --build
