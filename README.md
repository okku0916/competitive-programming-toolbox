# competitive-programming-toolbox

## 構築
```
# リポジトリのクローン
git clone https://github.com/okku0916/competitive-programming-toolbox.git
```
```
# 環境のインストール
cd competitive-programming-toolbox
npm install
```
またbackend内でdockerを利用しているためdocker環境が必要
dockerデスクトップで行う場合には下記URLからダウンロード
https://www.docker.com/ja-jp/products/docker-desktop/
ターミナルでimage gcc14をダウンロード
```
docker pull gcc:14
```

```
# アプリ起動
# competitive-programming-toolboxの階層で
npm run dev
```
http://localhost:5173/
に接続できれば完了

front, backを個々に動かす場合にはfrontend階層, backend階層それぞれで
```
npm run dev
```
