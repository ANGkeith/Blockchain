#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

script_directory=$(cd $(dirname ${BASH_SOURCE}) && pwd -P)
project_root=$(cd $(dirname ${script_directory}) && pwd -P)

until nc -zu bootnode 30301; do
     echo "bootnode is not yet ready, sleeping for 1 second"
     sleep 1
done
# hard code sleep to wait for bootnode to be ready.
sleep 5

my_datadir="$project_root"/app
rpcport=8545
port=30303
bootnode_ip=$(ping bootnode 2> /dev/null | sed 's/.*(\(.*\)).*/\1/g') || true
enode="enode://86b63c4689e7eebfb7aee64391d06c9303dacfbbbdb9ae2387ce54b5233041a12c59c2e3ded72320756b502a8a84166144b35b1bc1836d74533d2d743d1358bc@$bootnode_ip:0?discport=30301"

geth --nousb --datadir "$my_datadir" init "$my_datadir"/genesis.json
echo "$NODEKEY" > "$my_datadir"/geth/nodekey

geth --nousb --networkid 4224 --datadir "$my_datadir" --bootnodes "$enode"\
     --rpc --rpcaddr 0.0.0.0 --rpcport "$rpcport" --port "$port" \
     --rpccorsdomain "*" --nat "any" --rpcapi eth,web3,personal,net \
     --unlock "$account" --password "$my_datadir"/password.sec \
     --unlock "2e2c380c6f369e9f8f20b9092c659592919f5904" --password "$my_datadir"/password.sec \
     --allow-insecure-unlock --ipcpath "$HOME"/.ethereum/geth.ipc \
     --rpcvhosts="*" --miner.etherbase "$account" --nodiscover \
     --mine --miner.threads $miner_threads
