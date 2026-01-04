共通券
1f071d2e-22ee-697a-88cf-6e25d5b42b38

専用券
1f071d26-1083-64df-bf93-b226f447cf8b

paypay商品券の対応店舗検索ツールを作成したい

/home/thr3a/work/portfolio/src/paypay-shinagawa/*に作成して
コンポーネントは適宜分けて
/paypay-shinagawaにアクセスするとPage.tsxが見るようになってる

ページ開くと/shinagawa_paypay_senyou/sample.jsonを1度だけ読み込む
サーバー上ではpublic/shinagawa_paypay_senyou/sample.jsonがすでにある
店情報が入っているこれはサンプルデータだけど実際はもっと大きいので注意
1番上に1行の検索文字入力フォーム　オートフォーカス
デフォルトでは検索結果は何も表示しない
入力すると店名でLIKE検索する
ヒットしたお店をカード形式でコンパクトに表示
カード内にはアイコン画像が左、その隣に店名（太字　これが一番大きい）、ジャンル、
店名をクリックするとgoogle mapに新しいタブで遷移する「品川区 【店名】」で検索
検索URLは https://google.com/maps?q=*****

コンポーネントはすべてmantine使うこと

curl -L "https://github.com/openai/codex/releases/latest/download/codex-x86_64-unknown-linux-musl.tar.gz" | tar -xz -O | sudo tee /usr/local/bin/codex > /dev/null



カレントディレクトリに以下のようなjsonがたくさんある

```json
{"header":{"resultCode":"S0000","resultMessage":"Success"},"payload":{"features":null,"pointOfInterests":null,"stores":{"results":[{
  略
```

これを全部取得して1つのjsonにしたい result.json

```json
{
    "stores": [
        各jsonのresultsの配列を入れる
    ]
}
```

storesの配列ではネストはしない
例えば

「cat 1.json | jq '.payload.stores.results | length'」の結果が100
「cat 2.json | jq '.payload.stores.results | length'」の結果が100
だった場合は成果物のstoresの合計数は200になる
「cat result.json | jq '.stores | length'」 => 200

シェルスクリプトを作成して

❯ jq -r '.payload.stores.results[]? | select(.title == "info＆cafeSQUARE")' list*.json 


重複削除
cat result.json | jq --compact-output '.stores |= unique_by(.title)' > result_uniq.json

