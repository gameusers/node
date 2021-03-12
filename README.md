<!-- # [Game Users](https://gameusers.org/) -->

![Game Users Banner](https://gameusers.org/img/common/social/ogp_image.jpg)

[![node](https://img.shields.io/badge/node-v14.16.0-lightgrey.svg)](https://nodejs.org/ja/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v4.4.4-green.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-v20.10.3-blue.svg)](https://www.npmjs.com/)
[![Docker Compose](https://img.shields.io/badge/Docker%20Compose-v1.26.2-blue.svg)](https://www.npmjs.com/)
[![David](https://img.shields.io/david/expressjs/express.svg)]()
[![license](https://img.shields.io/badge/license-Game%20Users%20Project-blue.svg)](https://github.com/gameusers/node/blob/main/LICENSE.txt)
<a href="https://gitmoji.dev">
<img src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square" alt="Gitmoji">
</a>

Game Users はゲームに特化した総合サイトです。ゲームが好きな開発者やユーザーが集まって様々なコンテンツを作成できる場所にしたいと考えています。特定の個人や企業の所有物ではなく、世界中のゲーマーの共有プラットフォームに育てたいです。

一緒にこのサイトを開発してくれるプログラマーやデザイナーを募集しています。

開発者の取り分を可能な限り最大になるようにしたいという目標を掲げており、利用するリソースの代金（サーバー代など）を除いて、それ以外はすべて開発者の取り分にできれば理想の形になります。これはサイトの主要コンテンツではない独立したコンテンツをサイト内で公開した場合の想定です。コアな機能を開発する場合は収益に一定の上限を設ける予定です。主要コンテンツで特定の個人が大きすぎる利益を得ないようにするためです。最初は開発者それぞれの広告コードをサイト内に貼って収益につなげることを目指します。サイトが人気になるほど、返ってくるものも大きくなるはずです。

それぞれが各自いろいろな場所にゲーム関係の自作アプリケーションを公開しても、陰が生まれるほどの大樹にはなりえません。そこで最大限の収益を得られる環境を作り、様々な開発者が寄り集まることでメリットが生まれる場所にしたいのです。

この理想を実現させるにはクリーンでオープンなプロジェクトでなければならないと考えています。売上、経費、各開発者が得た利益などをすべて公開し、開発者間の話し合いもできるだけオープンな場所で行うことで、それを実現させたいです。

[運営中のウェブサイト](https://gameusers.org/)
<br /><br /><br />

# 開発環境の作り方

2 つの方法を用意しています。1 番の Docker を利用する方法が簡単でおすすめです。2 番はお使いの環境で Docker を利用できない場合、またはすでに Node.js と MongoDB のレプリカセットが利用できる環境である場合などに利用してください。

1. Docker を利用する方法
2. 個別にインストールする方法
   <br /><br /><br />

# Docker を利用する方法

Docker と Docker Compose がインストールされていて、簡単な使い方を理解している前提で話を進めていきます。上にこちらの環境で利用している Docker のバージョンを明記しています。インストールがうまく行かなかった場合は、上記のバージョンより新しいものにアップグレードしてください。
<br /><br />

## 1. インストール

まずインストールする場所を決めて、そちらに cd コマンドで移動してください。そして gameusers ディレクトリを作成し、その中に移動してください。

    mkdir gameusers
    cd gameusers

<br />

次にこちらのリポジトリからディレクトリ gameusers 内にファイルを clone してください。node というディレクトリが新たに作成され、その中にリポジトリのデータが配置されます。

    git clone git@github.com:gameusers/node.git

<br />

ディレクトリ node 内に移動。

    cd node

<br />

Docker を利用します。起動していない場合は、以下のコマンドなどで起動してください。

    sudo service docker start

<br />

ディレクトリのルートに [docker.sh](https://github.com/gameusers/node/blob/main/docker.sh) というファイルが用意されます。これは初回起動の処理をまとめたシェルスクリプトです。コンテナの起動、MongoDB のレプリカセットの設定、MongoDB のユーザー追加、サーバーの起動までを行います。以下は例です。配置した場所に合わせてパスを変更して実行してください。

    bash /home/（ユーザー名）/gameusers/node/docker.sh

シェルスクリプトが問題なく実行されればサーバーが起動します。
<br /><br />

[docker.sh](https://github.com/gameusers/node/blob/main/docker.sh) の実行は初回だけです。以後は以下のコマンドでサーバーを起動してください。これは Node.js のコンテナに入って npm run dev を実行するコマンドです。

    docker exec -it gameusers-node npm run dev

開発を進めているとエラーでサーバーが停止することがあります。その際も Cntl + C で一度停止してから、こちらのコマンドを入力してください。
<br /><br />

## 2. データベースに初期データを挿入する

データベースの中身は容量の関係上、GitHub 上には掲載されておらず、空のディレクトリと設定ファイルのみになっていますが、以下のページにアクセスすることで簡単に初期データが挿入できるようになっています。<br />

    http://localhost:8080/initialize

「データベース - データ挿入」と書かれたボタンがありますので、押してください。gameusers というデータベースに初期コレクションが挿入されます。<br />

上記ページには、開発している主要なページのリンクも貼られています。
<br /><br />

## 3. mongo-express

データベースの中身を視覚的に把握できる GUI ツールも入っています。下記アドレスにアクセスすると利用できます。

    http://localhost:8081/

データベースの構成などを確認する場合に利用すると便利です。<br />

詳しくは [mongo-express](https://github.com/mongo-express/mongo-express) を確認してください。
<br /><br />

## 4. その他のコマンド

よく使う Docker のコマンドを掲載しておきます。コピペして利用してください。

    # Node.js のコンテナで bash を実行する際に入力
    docker exec -it gameusers-node /bin/bash

    # Nginx のコンテナで bash を実行する際に入力
    docker exec -it gameusers-nginx /bin/bash

    # MongoDB のコンテナで bash を実行する際に入力
    docker exec -it gameusers-mongo1 /bin/bash
    docker exec -it gameusers-mongo2 /bin/bash
    docker exec -it gameusers-mongo3 /bin/bash


    # コンテナ起動
    docker-compose up -d

    # コンテナ停止
    docker-compose down

    # 開始
    docker-compose start

    # 停止
    docker-compose stop

    # コンテナ確認
    docker-compose ps

    # イメージ作成
    docker-compose build

    # イメージを作成してコンテナを起動
    docker-compose up -d --build

<br />

## 5. docker-compose build でエラーが出る場合

Docker でイメージを作成する際に以下のようなエラーが出る場合があります。

    npm ERR! code EAI_AGAIN
    npm ERR! errno EAI_AGAIN
    npm ERR! request to https://registry.npmjs.org/yallist/-/yallist-4.0.0.tgz failed, reason: getaddrinfo EAI_AGAIN registry.npmjs.org

これは名前解決が正常に行えないため、起きるエラーのようです。ネームサーバーを Google Public DNS に変更することで解決できますが、お使いの開発環境の設定を変更することになりますので、以下を実行する場合は自己責任で行ってください。

    # resolv.conf ファイルを開く
    sudo vi /etc/resolv.conf

    # nameserver を 8.8.8.8 に変更して保存
    nameserver ○.○.○.○
    ↓
    nameserver 8.8.8.8

<br /><br />

---

<br /><br />

# 個別にインストールする方法

## 1. インストール

Node.js が利用できない場合はインストールを行い、利用できる状態にしてください。そしてこちらのリポジトリから任意の場所にファイルを Clone（ダウンロード） してください。
そしてターミナルを開き、cd コマンドでファイルが置かれている場所に移動してから、npm を利用してパッケージをインストールしてください。

    npm install

<br />

## 2. 環境変数の設定

パッケージのインストールが終わったら、.env（環境変数を設定する） ファイルを開いて、NEXT_PUBLIC_URL_BASE と NEXT_PUBLIC_URL_API と書かれている部分を、開発環境でアクセスする URL に書き換えて保存してください。トップページのアドレスになります。デフォルトでは以下の値に設定されています（ポート番号は 8080）。特に問題がなければこのままの設定で利用してください。

    # URL
    NEXT_PUBLIC_URL_BASE=http://localhost:8080/
    NEXT_PUBLIC_URL_API=http://localhost:8080/api

<br />

## 3. データベース

次にデータベースの設定を行います。こちらの開発では MongoDB Ver.4 を利用しています。開発環境にインストールされていない場合、インストールを行ってください。MongoDB のトランザクション機能を利用するため、レプリカセット（複数のデータベースを立ち上げて繋げることで安定性を確保する機能）を構築しています。<br /><br />
**参考サイト**<br />

- [MongoDB で 3 台構成 の レプリカセット を 構築する 方法](https://garafu.blogspot.com/2018/02/mongodb-3instance-replicaset.html)
- [Deploy a Replica Set for Testing and Development](https://docs.mongodb.com/manual/tutorial/deploy-replica-set-for-testing/)<br /><br />

1. db/server1
2. db/server2
3. db/server3

こちらのディレクトリ内にデータとログが保存されるようになっています。レプリカセットの構築方法を簡単に解説しますが、環境によって変更が必要な箇所がある場合は、置き換えて読んでみてください。<br /><br />

1: ターミナルを 3 つ開き、各行のコマンドで MongoDB を 3 つ起動します。これは db/server 内に設置してあるコンフィグファイルを読み込んで、データベースを起動する方法です。

    # ターミナル 1
    mongod --config "db/server1/mongod.conf"

    # ターミナル 2
    mongod --config "db/server2/mongod.conf"

    # ターミナル 3
    mongod --config "db/server3/mongod.conf"

2: 4 つ目のターミナルを開き、Server1 にログインします。

    mongod --host 127.0.0.1:27017

3: レプリカセットを初期化

    rsconf = {
      _id : "rs0",
      members: [
        { _id: 0, host: "127.0.0.1:27017" },
        { _id: 1, host: "127.0.0.1:27018" },
        { _id: 2, host: "127.0.0.1:27019" },
      ]
    }
    rs.initiate(rsconf)

上記のとおりにコマンドを入力するとレプリカセットの設定が完了し、MongoDB でトランザクションが扱えるようになります。上記入力後は 4 つ目のターミナルから抜けてもらって構いません。
<br /><br />

## 4. 起動する

次に再度新しくターミナルを開き、以下のコマンドを入力してください。

    npm run dev

特に問題が起きなければ、アプリケーションが起動します。
<br /><br />

## 5. データベースに初期データを挿入する

データベースの中身は容量の関係上、GitHub 上には掲載されておらず、空のディレクトリと設定ファイルのみになっていますが、以下のページにアクセスすることで簡単に初期データが挿入できるようになっています。<br />

    http://localhost:8080/initialize

「データベース - データ挿入」と書かれたボタンがありますので、押してください。gameusers というデータベースに初期コレクションが挿入されます。<br />

上記ページには、開発している主要なページのリンクも貼られています。
<br /><br />

## 6. mongo-express

データベースの中身を視覚的に把握できる GUI ツールも入っています。ターミナルを開いて、以下を入力してください。mongo-express が起動します。<br />

    npm run mongo-express:start

次に下記アドレスにアクセスすると、Basic 認証が起動します。.env を編集した方はトップページのアドレスでポート番号だけを 8081 に変更してください。

    http://localhost:8081/

「ユーザー名：admin」「パスワード：pass」でログインしてください。データベースの構成などを確認する場合に利用すると便利です。<br />

詳しくは [mongo-express](https://github.com/mongo-express/mongo-express) を確認してください。

<br /><br /><br />

---

<br /><br />

# メモリ設定

## 開発環境で利用できるメモリ量に合わせる

デフォルトでは Node.js が利用できる最大メモリサイズは 4GB に設定されています。ご利用の開発環境で大きなメモリを扱えない場合は、以下の設定を利用できるメモリの範囲内に収めてください。

小さな値に変更した場合は、開発時にメモリが不足して JavaScript heap out of memory というエラーが出ることがあります。このエラー自体は開発ができなくなるような致命的なものではありませんので、できるだけエラーがでなくなるような適切なメモリ量を見つけて設定してください。

メモリに余裕のある場合は、大きめの値に設定するとエラーが起きにくくなります。

package.json ファイルを開くと scripts の欄に "dev": "NODE_ENV=development node --max-old-space-size=4096 server.js" と書かれた部分があります。ここの --max-old-space-size=4096 を変更します。

    # 1024(1GB) / 2048(2GB) / 3072(3GB) / 4096(4GB)
    --max-old-space-size=4096
    ↓
    --max-old-space-size=1024

<br /><br />

# その他

## 本番環境のモードで実行する

開発環境で利用する npm run dev でサーバーを起動すると動作がもっさりになりますが、本番環境のモードでサーバーを起動すると本来のスピードを試すことができます。以下のコマンドを順番に入力してください。

    # Docker の場合は、まず以下の1行で Node.js のコンテナ内に入ってから、下の2行を実行してください。
    docker exec -it gameusers-node /bin/bash

    npm run build
    npm start

<br />

## ライセンス

Game Users プロジェクトに帰属します。
