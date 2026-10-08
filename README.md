# PX Strategic Training — ゲームライブラリ

社内ボードゲーム研修のゲーム選択・ルール説明・振り返りをまとめた静的サイトです。

## 確認方法

ルートの `index.html` をブラウザで開いてください。ゲーム一覧から各ゲームの解説とInsightへ移動できます。外部ライブラリや外部フォントは使用していません。

## フォルダ構成

```text
px-strategic-training-redesign/
├─ index.html                 ゲーム選択ページ
├─ hub.css                    ゲーム選択ページ専用スタイル
├─ shared/
│  ├─ styles.css              全ページ共通スタイル
│  └─ app.js                  全ページ共通の操作
├─ games/
│  ├─ splendor/
│  │  ├─ index.html           ゲーム解説
│  │  ├─ insight.html         振り返り
│  │  ├─ styles.css           ゲーム固有スタイル
│  │  ├─ assets/              使用画像
│  │  └─ previews/            表示確認画像
│  ├─ coyote/
│  │  ├─ index.html           ゲーム解説
│  │  ├─ insight.html         振り返り
│  │  ├─ styles.css           ゲーム固有スタイル
│  │  ├─ assets/              使用画像
│  │  └─ previews/            表示確認画像
│  ├─ galaxy-trucker/
│  │  ├─ index.html           初回航海ガイド
│  │  ├─ styles.css           ゲーム固有スタイル
│  │  ├─ app.js               検索・早見表などの操作
│  │  ├─ assets/              使用画像
│  │  └─ previews/            表示確認画像
│  ├─ ito/
│  │  ├─ index.html           ゲーム解説
│  │  ├─ insight.html         振り返り
│  │  ├─ styles.css           ゲーム固有スタイル
│  │  ├─ app.js               お題抽選・完了ゲートなどの操作
│  │  └─ assets/              使用画像
│  └─ bohnanza/
│     ├─ index.html           ゲーム解説
│     ├─ insight.html         入力不要の振り返り
│     ├─ styles.css           ゲーム固有スタイル
│     ├─ app.js               画像拡大・完了ゲートの操作
│     └─ assets/              4つのルール図
├─ deposit_out/               作業知見の手元控え（公開不要）
└─ _workfiles/                制作中の比較・検証画像（公開不要）
```

## ゲームを追加するとき

1. `games/` に英数字のゲーム名でフォルダを作る
2. `index.html`、`insight.html`、`styles.css`、`assets/`、`previews/` を置く
3. CSSとJavaScriptは `../../shared/` を参照する
4. ルートの `index.html` にゲームカードを1件追加する
5. ローカル参照切れ、JavaScript構文、表示崩れを下記の必須基準で確認する

## 表示品質の必須基準

ページを追加・修正したときは、PCとスマホのどちらにも表示崩れを残さないことを完了条件とします。

- `320px`、`390px`、`768px`、`1024px`、`1440px` の5幅で実画面を確認する
- 横スクロール、文字や画像の見切れ、要素同士の重なり、不自然な縦書き・改行、過大な余白がないことを確認する
- PC表示は `1024px` と `1440px` の両方を確認し、スマホ表示だけで完了としない
- 操作前だけでなく、タブ切り替え、回答選択、詳細展開、結果表示など操作後の状態も確認する
- `scrollWidth` と `innerWidth` による機械確認に加え、各主要セクションのスクリーンショットを目視確認する
- ブレークポイント付近で一部のカードや文字だけが細く潰れていないか、中間幅も確認する
- HTML・CSS・JavaScriptを変更した後は上記確認を再実施し、崩れが残っている状態では完了にしない

## ページの役割

- ルート `index.html`：ゲームを選ぶ
- 各ゲームの `index.html`：遊び方だけに集中する
- 各ゲームの `insight.html`：プレイ後に意思決定を振り返る

Galaxy Truckerは要件に合わせ、ゲームページ内でBusiness Insightを開示していません。

## 公開するとき

ルートの `index.html`、`hub.css`、`shared/`、`games/` をGitHub Pagesへ配置します。`previews/`、`deposit_out/`、`_workfiles/`、このREADMEは公開に不要です。
