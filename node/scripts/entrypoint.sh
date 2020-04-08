#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset
script_directory=$(cd $(dirname ${BASH_SOURCE}) && pwd -P)
project_root=$(cd $(dirname ${script_directory}) && pwd -P)

cd app

until nc -z private-chain-1 8545; do
    echo "private-chain-1 is not yet ready, sleeping for 1 second"
    sleep 1
done

npm run truffle-migrate-geth

npm run dev
