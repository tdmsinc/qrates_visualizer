# QratesVisualizer

The vinyl visualizer for QRATES.

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'qrates_visualizer', git: 'git@github.com:tdmsinc/qrates_visualizer.git'
```

And then execute:

    $ bundle

## API

Asset pipeline から読み込んで利用します。

```js
//= require qrates_visualizer
```

名前空間 `qvv` 下に外部公開用のインタフェースを実装しています。

### VinylVisualizer

- VinylVisualizer(el:HTMLDivElement):VinylVisualizer
- VinylVisualizer#view(type:Number, opts:Object, callback:Function):VinylVisualizer
- VinylVisualizer#capture(opts:Object, callback:Function):VinylVisualizer
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
