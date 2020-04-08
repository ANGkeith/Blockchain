#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset
script_directory=$(cd $(dirname ${BASH_SOURCE}) && pwd -P)
project_root=$(cd $(dirname ${script_directory}) && pwd -P)

bootnode -addr 0.0.0.0:30301 -nodekey boot.key

