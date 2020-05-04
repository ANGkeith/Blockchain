#!/usr/bin/env bash

set -o pipefail
set -o nounset
set -o errexit

SCRIPT_DIRECTORY=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)
# shellcheck disable=SC2034
PROJECT_ROOT=$(cd "$(dirname "${SCRIPT_DIRECTORY}")" && pwd -P)

xhost +local:"${USER}"
export UID

docker-compose --compatibility up --build
