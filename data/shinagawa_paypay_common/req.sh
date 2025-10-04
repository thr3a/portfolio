#!/bin/bash

# ページネーションのカウンターを初期化
page=0

# 無限ループを開始
while true; do
    # 保存するファイル名を定義
    output_file="list${page}.json"

    # POSTするJSONデータをprintfを使って生成。%dの部分が$pageの値に置き換わるわ
    data=$(printf '{"query":"","searchTargets":{"stores":{"pagination":{"page":%d,"size":100},"filters":{"giftVouchers":{"enabled":true,"allConfigIds":["1f071d2e-22ee-697a-88cf-6e25d5b42b38"],"configIds":["1f071d2e-22ee-697a-88cf-6e25d5b42b38"]},"categories":null},"sortBy":"POPULARITY","additionalFieldsToInclude":["ADDRESS","WORKING_HOURS"]}}}' "$page")

    echo "ページ ${page} のデータを取得中..."

    # curlコマンドを実行し、HTTPレスポンスを変数に格納する
    response=$(curl -sS -X POST 'https://www.paypay.ne.jp/portal2/proxy/paypay-search/v1/gv/search' \
        -H 'Accept: application/json, text/plain, */*' \
        -H 'baggage: sentry-environment=Production,sentry-release=5.11.0,sentry-public_key=a0b12e9a956df1683da7fae385327469,sentry-trace_id=3d2d7828339c42ed965751c569384226,sentry-sample_rate=0.1,sentry-transaction=Detail,sentry-sampled=false' \
        -H 'paypayLang: ja' \
        -H 'Accept-Language: ja' \
        --compressed \
        -H 'sentry-trace: 3d2d7828339c42ed965751c569384226-a3cd4337fde9d4aa-0' \
        -H 'Content-Type: application/json' \
        -H 'Origin: https://www.paypay.ne.jp' \
        -H 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Safari jp.pay2.app.ios/5.16.0' \
        -H 'Referer: https://www.paypay.ne.jp/portal/dc/gift-voucher/details?gvConfigUUID=1f071d2e-22ee-697a-88cf-6e25d5b42b38' \
        -H 'Connection: keep-alive' \
        -H 'Cookie: Client-OS-Version=15.6.0; Device-Name=iPhone8%2C1; Device-UUID=999F0B07-09BD-42A4-BA77-059BC587B6F5; Is-Emulator=false; Lang=ja; Network-Status=WIFI; WEB-VERSION_dc=5.11.0; token=ICAgeyJraWQiOiJ1bS1qd2UtRk56Q3EzYm5KYkx6RFRmbjN0ZUhaczRhbFZCZWc5Uk4iLCJ0eXAiOiJhdCtqd3QiLCJlbmMiOiJBMjU2R0NNIiwidGFnIjoiVmthMkdHbVRNdzhiRDdqbkZjY09RZyIsImFsZyI6IkEyNTZHQ01LVyIsIml2IjoiMWJMc0FpSUkwUW5fYzV2eiJ9~HmHJUm0zcH3e5Jm_yDTywcDUH-4Ff-1-9FFdPNZtz2M~QKLof7ubhyqsUMWg~-aY4O8wLNBsp08WS4e4ixh2F0chZ5Cao-HS03O4WV59nSRw1eKKEnRwciv9mWc3ckJGkBQIUB8od_6O98t9SZlTnr0UMIUqmPl_4oe5MhHwA_P1ponzyETyEVd6PK5IJS46VPf6L-iQSQUTkhw710UuI1SederK5pgV72F1Tm6NKqhTVcTW0dnClKL1jSX8FNbmXl8KdSQLCeEelwWzIlvGHQAsJM1N3Dn3m3p1Sw1sqQSo5XSCQDOiznqLes7FC_AlhFz7H1h19HGcy7uyq8rhLDSm-jEfBFnA_RxmO7tybQlAjBSyIehQAIJ5XNI9vZPYCdzrRW1yjJVgrjxXKsIbU0Cj5_TyXHcQ5Fz-nUf5BlnZf0e_Uq-roKp_uk0MZTUuPMmnGjNc-D5oICv2evPkUgBIRJPofN3RUsb401C0UU4I9IIuJfjvQrc7Oe8Y99m7gdJ4a_AcR6C3EJXLpiFQHGQiwbKUR-535KTLr0em8Q1k43E9a8mo69Y2sKeyyEiUkVjnDjcL-6m0YZ-VfSSmYo1qY-2b_f6gEGlr1A7LJENdSveBvEArEq--etHvc29TNlwekSZYwjV-c21hMdl2h2NA50aDkaEiOcVe44ZGd4KmmHyLozjqiUOytQyllgxuNUtS3P8FPVbEMX_1RsihLCHUa44lurIxXsL_kmamYjKN-V10mP51k5e5rWerUulDYbEoMGXlkELqAa-Qpxr86peV4D1jUqLWDGuSc_Z7u72KVu_FnmNGAM7n2t_IxwZWqDHqSew7-CX_MH1qib51cFVTTrMjhG3-AaVZ5xnAOp5GazBQiYMurm-J-YrRUANKl6AiMA9dEW-hpW429CV2LVs39rTpR53yn0lDtrBMHNvNAZpPCZ4sTJ0YLYPmNXElx1ekBKiKYYcVd9oYlIMKxzhKYq9Fr_OAdu67TOHsUmDZGSVslWoyhYxxieaIjJCMy3QpiwqYDeTBkDBeJT1p3D7mrkCauuUeob79ldaIfNtpPbZ9yJzt_igTvcFvKnC76MUiuxLebhMqaT9sKEl-YjEBVyttZ5z17S4lDYKjGvvJw1TaypiCJ_9y83XiNmgLSmWBoe0q6OwiRCvK8OALFipPSHo0WdlN2gdYiJz3Qig6FL_bfCDnNfiXUNWFJPlcgVjTrKaulqQ8QsAjJYdM-~zlAYNv0B-XvbZDKLYL6ypQ; _ga_7132YDGZW4=GS2.1.s1755272078$o1$g1$t1755273667$j9$l0$h0; _ga=GA1.1.925471084.1755272079; _gid=GA1.3.666694017.1755272079; WEB-VERSION_coupon-corner=5.16.0; mAT=T; WEB-VERSION_oauth2=5.16.0; OA2_last_method=mobile; OptanonConsent=isGpcEnabled=0&datestamp=Sat+Aug+16+2025+00%3A34%3A39+GMT%2B0900+(JST)&version=202403.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&genVendors=V3%3A0%2CV9%3A0%2CV6%3A0%2CV10%3A0%2CV4%3A0%2CV2%3A0%2C&consentId=0dd45c69-601c-482c-9aa0-5924f06ca80c&interactionCount=1&isAnonUser=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A1%2CC0002%3A1%2CC0004%3A0&geolocation=JP%3B13&AwaitingReconsent=false; OptanonAlertBoxClosed=2025-08-15T15:34:38.538Z; _ga_PF38JVZL71=GS2.1.s1755272078$o1$g0$t1755272078$j60$l0$h0; WEB-VERSION_profile=5.16.0' \
        -d "$data")

    # レスポンスに"S0000"が含まれているか確認。含まれていなければループを抜ける
    if ! echo "$response" | grep -q '"resultCode":"S0000"'; then
        echo "これ以上取得できるデータがないか、エラーが発生しました。処理を終了します。"
        # 最後のレスポンス内容をターミナルに表示して、何が起きたか確認しやすくするわ
        echo "--- Last Response ---"
        echo "$response"
        echo "---------------------"
        break
    fi

    # レスポンスをファイルに書き込む
    echo "$response" > "$output_file"
    echo "データを ${output_file} に保存しました。"

    # ページカウンターをインクリメント
    page=$((page + 1))

    # APIへの過度な負荷を避けるため、1秒待機する
    sleep 1
done

echo "全ての処理が完了しました。"
