# QratesVisualizer

The vinyl visualizer for QRATES.

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'qrates_visualizer', git: 'git@github.com:tdmsinc/qrates_visualizer.git'
```

And then execute:

    $ bundle

## Debugging

単体動作確認用の Sinatra アプリケーションを起動して動作を確認できます。編集後の再起動は必要ありません。

    $ bundle exec rackup
    $ open http://localhost:9292/

アップデートの目処が立ったところで、[QRATES 本体](https://github.com/tdmsinc/qrates) にて `bundle update qrates_visualizer` を実行し、変更を反映してください。

## API

Asset pipeline から読み込んで利用します。

```js
//= require qrates_visualizer
```

名前空間 `qvv` 下に外部公開用のインタフェースを実装しています。

### VinylVisualizer

#### VinylVisualizer(el:HTMLDivElement, opts:Object):VinylVisualizer

VinylVisualizer のコンストラクタ。

- `el:HTMLDivElement`: コンテナ要素。
- `opts:Object`
  - `opts.defaults.vinyl:Object`: Vinyl の初期値。
  - `opts.defaults.label:Object`: Label の初期値。
  - `opts.defaults.sleeve:Object`: Sleeve の初期値。

#### VinylVisualizer#view(type:Number, opts:Object, callback:Function.&lt;Error&gt;):VinylVisualizer

ビューのプリセットを切り替えます。姿勢変更時に利用します。

- `type:Number`: プリセット番号。
- `opts:Object`
  - `opts.duration:Number`: トランジションのミリ秒。
- `callback:Function.<Error>`: トランジション完了後に実行されるコールバック関数。
  - `Error`: エラーオブジェクト。エラー未発生時は `null` です。

#### VinylVisualizer#startAutoRotation(opts:Object):VinylVisualizer

自動でビューのプリセットを変更します。

- `opts:Object`
  - `opts.interval:Number`: 切り替えのインターバルをミリ秒で指定。デフォルト値 4000。
  - `opts.duration:Number`: トランジションにかかる時間をミリ秒で指定。デフォルト値 1000。

#### VinylVisualizer#stopAutoRotation(opts:Object):VinylVisualizer

`VinylVisualizer#startAutoRotation` で開始した自動プリセット切り替えを停止します。

- `opts:Object`

#### VinylVisualizer#capture(opts:Object, callback:Function.&lt;Error, Image&gt;):VinylVisualizer

レンダリング結果をキャプチャします。通常 `#view` メソッドと組み合わせて利用します。

- `opts:Object`
- `callback:Function<Error, Image>`: キャプチャ終了時に実行されるコールバック関数。
  - `Error`: エラーオブジェクト。エラー未発生時は `null` です。
  - `Image`: キャプチャ結果。

#### VinylVisualizer#resize(width:Number, height:Number):VinylVisualizer

ビジュアライザのリサイズを行います。リサイズは `#capture` メソッドのキャプチャ結果にも影響があります。

- `width:Number`: 横幅。
- `height:Number`: 高さ。

#### VinylVisualizer#play():VinylVisualizer

Vinyl の回転を開始します。

#### VinylVisualizer#pause():VinylVisualizer

Vinyl の回転を停止します。

#### VinylVisualizer#startRender():VinylVisualizer

WebGL のレンダリングを開始します。

#### VinylVisualizer#stopRender():VinylVisualizer

WebGL のレンダリングを一時停止します。

#### VinylVisualizer#lookReverse():VinylVisualizer

オブジェクトの裏側にカメラを移動します。

#### VinylVisualizer#lookAround(degree:Number):VinylVisualizer

オブジェクトに対するカメラの位置をインクリメンタルに変更します。

- `degree:Number`: カメラの移動量を角度で指定。負数で逆回転します。

#### VinylVisualizer#cover(value:Number):VinylVisualizer

Vinyl が Sleeve に収納されている状況を指定します。

- `value`: 収納状態を値で指定します。0 が完全に Sleeve に収まっている状態、1 が完全に Sleeve から出ている状態。

#### VinylVisualizer#zoom(distance:Number):VinylVisualizer

ズームレベルを変更します。

- `distance:Number`: ズームレベルを座標で指定。通常 200 ~ 400 の間を指定します。

#### VinylVisualizer#sleeveVisibility(value:Boolean):VinylVisualizer

Sleeve の可視状態を変更します。

- `value:Boolean`
  - `true`: Sleeve を可視状態に変更
  - `false`: Sleeve を不可視状態に変更

#### VinylVisualizer.vinyl:Vinyl

Vinyl モデルのハンドラ。

#### VinylVisualizer.label:Label

Label モデルのハンドラ。

#### VinylVisualizer.sleeve:Sleeve

Sleeve モデルのハンドラ。

### Vinyl

#### Vinyl#type([value:Number]):Vinyl

タイプを指定します。引数を省略すると現在値を返します。

- `value:Number`
  - `1`: black
  - `2`: color
  - `3`: splatter

#### Vinyl#size([value:Number]):Vinyl

サイズを指定します。引数を省略すると現在値を返します。

- `value:Number`
  - `1`: 7″
  - `2`: 10″
  - `3`: 12″

#### Vinyl#color([value:Number]):Vinyl

カラーを設定します。引数を省略すると現在値を返します。

- `value:Number`
  - `0`: Black
  - `1`: White
  - `2`: Yellow
  - `3`: Red
  - `4`: Orange
  - `5`: Blue
  - `6`: Brown
  - `7`: Green
  - `8`: Gray
  - `9`: Transparent Green
  - `10`: Transparent Yellow
  - `11`: Transparent Red
  - `12`: Transparent Violet
  - `13`: Transparent Blue
  - `14`: Transparent

#### Vinyl#splatterColor([value:Number]):Vinyl

スプラッター用の二色目を設定します。引数を省略すると現在値を返します。

- `value:Number`
  - _`Vinyl#color`_ のパラメータと同様。

#### Vinyl#holeSize([value:Number]):Vinyl

ホールサイズを指定します。引数を省略すると現在値を返します。

- `value:Number`
  - `0`: small
  - `1`: big

#### Vinyl#heavy([value:Boolean]):Vinyl

ヘビー vinyl を有効化・無効化します。引数を省略すると現在値を返します。

- `value:Boolean`
  - `true`: 有効
  - `false`: 無効

#### Vinyl#speed([value:Number]):Vinyl

回転数を指定します。引数を省略すると現在値を返します。

- `value:Number`
  - `33`: 33rpm
  - `45`: 45rpm

#### Vinyl#sideATexture([value:Image]):Vinyl

A 面用の盤面のテクスチャを指定します。引数を省略すると現在値を返します。

- `value:Image`: Image は `HTMLImageElement` か `HTMLCanvasElement` で指定してください。

#### Vinyl#sideBTexture([value:Image]):Vinyl

B 面用の盤面のテクスチャを指定します。引数を省略すると現在値を返します。

- `value:Image`: Image は `HTMLImageElement` か `HTMLCanvasElement` で指定して下さい。

#### ~~Vinyl#bumpMapTexture([value:Image]):Vinly~~ [Deprecated]

~~盤面の溝を表現するためのバンプマップ用テクスチャを指定します。引数を省略すると現在値を返します。~~

- ~~`value:Image`: Image は `HTMLImageElement` か `HTMLCanvasElement` で指定して下さい。~~

廃止予定のメソッドです。`Vinyl#sideAbumpMapTexture` か `Vinyl#sideBBumpMapTexture` を替わりに使ってください。

#### Vinyl#sideABumpMapTexture([value:Image]):Vinly

A 面の溝を表現するためのバンプマップ用テクスチャを指定します。引数を省略すると現在値を返します。

- `value:Image`: Image は `HTMLImageElement` か `HTMLCanvasElement` で指定して下さい。

#### Vinyl#sideBBumpMapTexture([value:Image]):Vinly

B 面の溝を表現するためのバンプマップ用テクスチャを指定します。引数を省略すると現在値を返します。

- `value:Image`: Image は `HTMLImageElement` か `HTMLCanvasElement` で指定して下さい。

### Label

#### Label#type([value:Number]):Label

タイプを指定します。引数を省略すると現在値を返します。

- `value:Number`
  - `1`: white
  - `2`: print - monochrome
  - `3`: print - color

#### Label#sideATexture([value:Image]):Label

A 面用のレーベルのテクスチャを指定します。引数を省略すると現在値を返します。

- `value:Image`: Image は `HTMLImageElement` か `HTMLCanvasElement` で指定してください。

#### Label#sideBTexture([value:Image]):Label

B 面用のレーベルのテクスチャを指定します。引数を省略すると現在値を返します。

- `value:Image`: Image は `HTMLImageElement` か `HTMLCanvasElement` で指定してください。

### Sleeve

#### Sleeve#type([value:Number]):Sleeve

タイプを指定します。引数を省略すると現在値を返します。

- `value:Number`
  - `1`: black
  - `2`: white
  - `3`: print
  - `4`: print - 3mm spine

#### Sleeve#hole([value:Boolean]):Sleeve

ホールの有無を指定します。引数を省略すると現在値を返します。

- `value:Boolean`
  - `true`: ホールあり
  - `false`: ホールなし

#### Sleeve#glossFinish([value:Boolean]):Sleeve

光沢仕上げの有無を指定します。引数を省略すると現在値を返します。

- `value:Boolean`
  - `true`: 光沢仕上げあり
  - `false`: 光沢仕上げなし

#### Sleeve#frontTexture([value:Image]):Sleeve

前面のテクスチャを指定します。引数を省略すると現在値を返します。

- `value:Image`: Image は `HTMLImageElement` か `HTMLCanvasElement` で指定してください。

#### Sleeve#backTexture([value:Image]):Sleeve

背面のテクスチャを指定します。引数を省略すると現在値を返します。

- `value:Image`: Image は `HTMLImageElement` か `HTMLCanvasElement` で指定してください。

#### Sleeve#spineTexture([value:Image]):Sleeve

背表紙のテクスチャを指定します。引数を省略すると現在値を返します。

- `value:Image`: Image は `HTMLImageElement` か `HTMLCanvasElement` で指定してください。
