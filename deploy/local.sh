brew services start mongodb-community@5.0
#mongod --config /opt/homebrew/etc/mongod.conf
#docker run --name some-mongo -d mongo
export MONGO_HOST=127.0.0.1
export ADMIN_OPEN=1
yarn run devstart