#!/bin/bash

# コンテナ起動
docker-compose up -d

# レプリカセットの設定
docker-compose exec mongo1 mongo --host localhost /src/docker/mongo/init-replica-set.js


# 遅延処理　次の処理をすぐに実行すると、レプリカセットのセカンダリにデータを書き込もうとしてエラーが起きるので遅延している
echo "Wait 30 seconds!"
sleep 30s


# MongoDB にユーザーを追加する
# この部分でまれにエラーが出るので、その場合は docker-compose down でコンテナを停止してから
# 再度、このシェルスクリプトを実行してみてください
# それでもエラーが出る場合は以下の2行をコメントアウトしてください。MongoDB のユーザーを追加しなくても動作には影響ありません

# ローカルホスト例外で、rootユーザーを作成
docker-compose exec mongo1 mongo --host localhost /src/docker/mongo/init-user-root.js

# ユーザー作成後はローカルホスト例外を利用できないので、認証しなおして gameusers用のユーザーを作成
docker-compose exec mongo1 mongo admin -u root -p password /src/docker/mongo/init-user-gameusers.js


# パッケージインストール
docker exec -it gameusers-node npm install

# サーバー起動
docker exec -it gameusers-node npm run dev


exit 0