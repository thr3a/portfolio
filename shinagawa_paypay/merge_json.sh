#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 出力ファイル名
output_file="$SCRIPT_DIR/result.json"

# 一時ファイル
temp_file="$SCRIPT_DIR/temp_merged.json"

common_dir="$SCRIPT_DIR/../../data/shinagawa_paypay_common"
senyou_dir="$SCRIPT_DIR/../../data/shinagawa_paypay_senyou"

shopt -s nullglob
# json_files=("$common_dir"/list*.json "$senyou_dir"/list*.json)
json_files=("$senyou_dir"/list*.json)
shopt -u nullglob

if [ "${#json_files[@]}" -eq 0 ]; then
  echo "対象のJSONファイルが見つかりません" >&2
  exit 1
fi

# data配下の対象JSONファイルを処理
# jqで各ファイルの.payload.stores.resultsを抽出し、全て結合
jq -n '[inputs | .payload.stores.results[]]' "${json_files[@]}" > "$temp_file"

# 最終的な形式に整形
jq '{stores: .}' "$temp_file" > "$output_file"

# 一時ファイルを削除
rm "$temp_file"

# 結果の確認
echo "統合完了: $(jq '.stores | length' "$output_file") 件のstoreを統合しました"
