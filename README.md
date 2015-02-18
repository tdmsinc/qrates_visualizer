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

- VinylVisualizer(el:HTMLDivElement):VinylVisualizer
- VinylVisualizer#view(type:Number, opts:Object, callback:Function.&lt;Error&gt;):VinylVisualizer
- VinylVisualizer#capture(opts:Object, callback:Function.&lt;Error, Image&gt;):VinylVisualizer
- VinylVisualizer#resize(width:Number, height:Number):VinylVisualizer
- VinylVisualizer.vinyl:Vinyl
- VinylVisualizer.label:Label
- VinylVisualizer.sleeve:Sleeve

### Vinyl

- Vinyl#type([value:Number]):Vinyl
- Vinyl#size([value:Number]):Vinyl
- Vinyl#baseColor([value:Number]):Vinyl
- Vinyl#transparentColor([value:Number]):Vinyl
- Vinyl#holeSize([value:Number]):Vinyl
- Vinyl#heavy([value:Boolean]):Vinyl
- Vinyl#speed([value:Number]):Vinyl

### Label

- Label#type([value:Number]):Label
- Label#sideATexture([value:Image]):Label
- Label#sideBTexture([value:Image]):Label

### Sleeve

- Sleeve#type([value:Number]):Sleeve
- Sleeve#hole([value:Number]):Sleeve
- Sleeve#glossFinished([value:Boolean]):Sleeve
- Sleeve#texture([value:Image]):Sleeve
