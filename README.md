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
  - `opts.trasition:Number`: トランジションのミリ秒。
- `callback:Function.<Error>`: トランジション完了後に実行されるコールバック関数。
  - `Error`: エラーオブジェクト。エラー未発生時は `null` です。

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

#### VinylVisualizer.vinyl:Vinyl

Vinyl モデルのハンドラ。

#### VinylVisualizer.label:Label

Label モデルのハンドラ。

#### VinylVisualizer.sleeve:Sleeve

Sleeve モデルのハンドラ。

### Vinyl

#### Vinyl#type([value:Number]):Vinyl
#### Vinyl#size([value:Number]):Vinyl
#### Vinyl#color([value:Number]):Vinyl
#### Vinyl#splatterColor([value:Number]):Vinyl
#### Vinyl#holeSize([value:Number]):Vinyl
#### Vinyl#heavy([value:Boolean]):Vinyl
#### Vinyl#speed([value:Number]):Vinyl
#### Vinyl#sideATexture([value:Image]):Vinyl
#### Vinyl#sideBTexture([value:Image]):Vinyl

### Label

#### Label#type([value:Number]):Label
#### Label#sideATexture([value:Image]):Label
#### Label#sideBTexture([value:Image]):Label

### Sleeve

#### Sleeve#type([value:Number]):Sleeve
#### Sleeve#hole([value:Number]):Sleeve
#### Sleeve#glossFinished([value:Boolean]):Sleeve
#### Sleeve#frontTexture([value:Image]):Sleeve
#### Sleeve#backTexture([value:Image]):Sleeve
#### Sleeve#spineTexture([value:Image]):Sleeve
