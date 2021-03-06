#!/usr/bin/env bash

set -o pipefail
set -o nounset
set -o errexit

SCRIPT_DIRECTORY=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)
# shellcheck disable=SC2034
PROJECT_ROOT=$(cd "$(dirname "${SCRIPT_DIRECTORY}")" && pwd -P)

cd app

until nc -z private-chain-1 8545; do
    echo "private-chain-1 is not yet ready, sleeping for 1 second"
    sleep 1
done

npm run truffle-migrate-geth
# truffle exec ../scripts/pre-populate.js --network geth
npm run dev
