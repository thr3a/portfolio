# 必ず守ること

- ユーザーは日本人です。思考や途中経過は英語で、コード内のコメントと最終出力、質問は日本語でお願いします。
- 既存のコードコメントは指示がない限り変えないこと
- npm run buildは行わない
- 指示されるまではAIのモデル名(gpt-4oなど)は勝手に変更しないこと
- 型定義はinterfaceではなくtypeを使用してください。
- any型は絶対に使用しないでください。
- asを使った型アサーションは原則使用しないください。やむを得ず使用する場合はコードコメントを書いてください。
- classは絶対に使用しないでください。
- 関数はアロー関数を使用してください。
- 早期リターンを使って条件分岐をフラット化してください。
- try catch の使用は最低限に留め過度な使用を避けてください。
- なるべくmantineライブラリが用意したhookを利用すること
- tsxでスタイル設定するときは可能な限りMantineで使用可能なStyle propsを使うこと。（Mantineで使用可能なStyle props参照）
ない場合はstyle使う

```tsx
<Box mx="auto" maw={400} c="blue.6" bg="#fff">
</Box>
```


```tsx
# whiteSpaceはない
<Text style={{whiteSpace: 'nowrap'}}>
</Text>
```

- src/scripts以下のTypyscriptコード実行する場合は `node --import tsx ./src/scripts/hello.ts` とすること 特に指示がなければ許可なく自動実行して良い。

# ライブラリ概要

- 言語: TypeScript
- UI: React v19 Mantine v8
- hook: mantine hook
- lint: biome

# Mantineで使用可能なStyle props

All Mantine components that have root element support the following style props:

| Prop    | CSS Property         | Theme key         | 
| ------- | -------------------- | ----------------- | 
| m       | margin               | theme.spacing     | 
| mt      | marginTop            | theme.spacing     | 
| mb      | marginBottom         | theme.spacing     | 
| ml      | marginLeft           | theme.spacing     | 
| mr      | marginRight          | theme.spacing     | 
| ms      | marginInlineStart    | theme.spacing     | 
| me      | marginInlineEnd      | theme.spacing     | 
| mx      | marginInline         | theme.spacing     | 
| my      | marginBlock          | theme.spacing     | 
| p       | padding              | theme.spacing     | 
| pt      | paddingTop           | theme.spacing     | 
| pb      | paddingBottom        | theme.spacing     | 
| pl      | paddingLeft          | theme.spacing     | 
| pr      | paddingRight         | theme.spacing     | 
| ps      | paddingInlineStart   | theme.spacing     | 
| pe      | paddingInlineEnd     | theme.spacing     | 
| px      | paddingInline        | theme.spacing     | 
| py      | paddingBlock         | theme.spacing     | 
| bd      | border               | –                | 
| bg      | background           | theme.colors      | 
| c       | color                | –                | 
| opacity | opacity              | –                | 
| ff      | fontFamily           | –                | 
| fz      | fontSize             | theme.fontSizes   | 
| fw      | fontWeight           | –                | 
| lts     | letterSpacing        | –                | 
| ta      | textAlign            | –                | 
| lh      | lineHeight           | theme.lineHeights | 
| fs      | fontStyle            | –                | 
| tt      | textTransform        | –                | 
| td      | textDecoration       | –                | 
| w       | width                | theme.spacing     | 
| miw     | minWidth             | theme.spacing     | 
| maw     | maxWidth             | theme.spacing     | 
| h       | height               | theme.spacing     | 
| mih     | minHeight            | theme.spacing     | 
| mah     | maxHeight            | theme.spacing     | 
| bgsz    | backgroundSize       | –                | 
| bgp     | backgroundPosition   | –                | 
| bgr     | backgroundRepeat     | –                | 
| bga     | backgroundAttachment | –                | 
| pos     | position             | –                | 
| top     | top                  | –                | 
| left    | left                 | –                | 
| bottom  | bottom               | –                | 
| right   | right                | –                | 
| inset   | inset                | –                | 
| display | display              | –                | 
| flex    | flex                 | –                | 
