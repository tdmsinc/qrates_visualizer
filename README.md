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
  - `opts.width:Number`: 描画領域の幅。
  - `opts.height:Number`: 描画領域の高さ。
  - `opts.pixelRatio:Number`: ピクセル比率。省略時は `window.devicePixelRatio` を利用します。
  - `opts.renderer:Object`: レンダラの初期値。
    - `opts.renderer.antialias:Boolean`: アンチエイリアス有効化。
    - `opts.renderer.alpha:Boolean`: アルファブレンディング有効化。
    - `opts.renderer.preserveDrawingBuffer:Boolean`: (?) キャプチャを利用する場合 `true` を指定してください。
  - `opts.camera:Object`: カメラの設定値。
    - `opts.camera.fov:Number`: 視野角。
    - `opts.camera.aspect:Number`: アスペクト比。
    - `opts.camera.near:Number`: 近接オブジェクト描画閾値。
    - `opts.camera.far:Number`: 遠隔オブジェクト描画閾値。
    - `opts.camera.type:String`: カメラの投影法の初期値。省略時は `perspective` 扱いになります。
      - `perspective`: 透視投影法 (パースあり) でレンダリング。
      - `orthographic`: 平行投影法 (パースなし) でレンダリング。
  - `opts.defaults.vinyl:Object`: Vinyl の初期値。
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

#### VinylVisualizer#flip(opts:Object):VinylVisualizer

オブジェクトの裏側にカメラを移動します。

- `opts:Object`
  - `opts.duration:Number`: トランジションにかかる時間をミリ秒で指定。

#### VinylVisualizer#rotateHorizontal(degree:Number, opts:Object):VinylVisualizer

オブジェクトを水平方向にインクリメンタルに回転させます。

- `degree:Number`: 回転量を角度で指定。負数で逆回転します。
- `opts:Object`
  - `opts.duration:Number`: トランジションにかかる時間をミリ秒で指定。

#### VinylVisualizer#rotateVertical(degree:Number, opts:Object):VinylVisualizer

オブジェクトを垂直方向にインクリメンタルに回転させます。

- `degree:Number`: 回転量を角度で指定。負数で逆回転します。
- `opts:Object`
  - `opts.duration:Number`: トランジションにかかる時間をミリ秒で指定。

#### VinylVisualizer#lookAround(degree:Number, opts:Object):VinylVisualizer

`VinylVisualizer#rotateHorizontal` のエイリアス。

#### VinylVisualizer#cover(value:Number, opts:Object):VinylVisualizer

Vinyl が Sleeve に収納されている状況を指定します。

- `value:Number`: 収納状態を値で指定します。`0` が完全に Sleeve に収まっている状態、`1` が完全に Sleeve から出ている状態。
- `opts:Object`
  - `opts.duration:Number`: トランジションにかかる時間をミリ秒で指定。
  - `opts.delay:Number`: トランジション開始までのディレイをミリ秒で指定。
  - `opts.index:VinylVisualizer.VinylIndex[FIRST|SECOND]`: Sleeve のタイプが Double または Gatefold の場合、index で指定した Vinyl の位置が変更されます。

#### VinylVisualizer#zoom(step:Number, opts:Object):VinylVisualizer

ズームレベルをインクリメンタルに変更します。値は正数指定で寄り、負数指定で引きです。

- `step:Number`: ズームレベルを指定。
- `opts:Object`
  - `opts.duration:Number`: トランジションにかかる時間をミリ秒で指定。

#### VinylVisualizer#vinylVisibility(index:String, value:Boolean, opts:Object, callback:Function.&lt;Error&gt;):VinylVisualizer

Vinyl の可視状態を変更します。

- `index:String`
  - `VinylVisualizer.VinylIndex.FIRST`
  - `VinylVisualizer.VinylIndex.SECOND`: 2枚組になっていない場合は無効
- `value:Boolean`
  - `true`: Vinyl を可視状態に変更
  - `false`: Vinyl を不可視状態に変更
- `opts:Object`
  - `duration:Number`: トランジションにかかる時間をミリ秒で指定。デフォルト値 1000。
- `callback:Function.&lt;Error&gt;`: トランジション終了時に呼び出されるコールバック関数。

#### VinylVisualizer#sleeveVisibility(value:Boolean, opts:Object, callback:Function.&lt;Error&gt;):VinylVisualizer

Sleeve の可視状態を変更します。

- `value:Boolean`
  - `true`: Sleeve を可視状態に変更
  - `false`: Sleeve を不可視状態に変更
- `opts:Object`
  - `duration:Number`: トランジションにかかる時間をミリ秒で指定。デフォルト値 1000。
- `callback:Function.&lt;Error&gt;`: トランジション終了時に呼び出されるコールバック関数。

#### ViinylVisualizer#setOrthographic():VinylVisualizer

視点を平行投影 (パースなし) に切り替えます。

#### ViinylVisualizer#setPerspective():VinylVisualizer

視点を透視投影 (パースあり) に切り替えます。

#### VinylVisualizer.vinyl:Vinyl

Vinyl モデルのハンドラ。

#### VinylVisualizer.sleeve:Sleeve

Sleeve モデルのハンドラ。

### Vinyl

#### Vinyl#size([value:String]):Vinyl

サイズを指定します。引数を省略すると現在値を返します。

- `value:String`
  - `VinylVisualizer.VinylSize.SIZE_7_SMALL_HOLE`: 7″ with small hole
  - `VinylVisualizer.VinylSize.SIZE_7_LARGE_HOLE`: 7″ with large hole
  - `VinylVisualizer.VinylSize.SIZE_10`: 10″
  - `VinylVisualizer.VinylSize.SIZE_12`: 12″

#### Vinyl#weight([value:String]):Vinyl

ウェイトを指定します。引数を省略すると現在値を返します。

- `value:String`
  - `VinylVisualizer.VinylWeight.NORMAL`: ノーマル
  - `VinylVisualizer.VinylWeight.HEAVY`: ヘビー

#### Vinyl#label([value:String]):Vinyl

カラーのフォーマットを指定します。引数を省略すると現在値を返します。

- `value:String`
  - `VinylVisualizer.VinylLabel.NONE`: レーベルなし
  - `VinylVisualizer.VinylLabel.BLANK`: 無地
  - `VinylVisualizer.VinylLabel.MONO_PRINT`: モノクロプリント
  - `VinylVisualizer.VinylLabel.COLOR_PRINT`: カラープリント

#### Vinyl#colorFormat([value:String]):Vinyl

カラーのフォーマットを指定します。引数を省略すると現在値を返します。

- `value:String`
  - `VinylVisualizer.VinylColorFormat.BLACK`: ブラック
  - `VinylVisualizer.VinylColorFormat.COLOR`: カラー
  - `VinylVisualizer.VinylColorFormat.SPECIAL`: スペシャルカラー
  - `VinylVisualizer.VinylColorFormat.PICTURE`: ピクチャー盤

#### Vinyl#color([value:Object]):Vinyl

カラーを設定します。引数を省略すると現在値を返します。

`colorFormat` が `VinylVisualizer.VinylColorFormat.COLOR` の場合にのみ有効です。


- `value:Object`
  - `VinylVisualizer.VinylColor.CLASSIC_BLACK`: Black
  - `VinylVisualizer.VinylColor.WHITE`: White
  - `VinylVisualizer.VinylColor.EASTER_YELLOW`: Yellow
  - `VinylVisualizer.VinylColor.RED`: Red
  - `VinylVisualizer.VinylColor.HALLOWEEN_ORANGE`: Orange
  - `VinylVisualizer.VinylColor.CYAN_BLUE`: Blue
  - `VinylVisualizer.VinylColor.DOOKIE_BROWN`: Brown
  - `VinylVisualizer.VinylColor.DOUBLE_MINT`: Green
  - `VinylVisualizer.VinylColor.GREY`: Gray
  - `VinylVisualizer.VinylColor.KELLY_GREEN`: Transparent Green
  - `VinylVisualizer.VinylColor.PISS_YELLOW`: Transparent Yellow
  - `VinylVisualizer.VinylColor.BLOOD_RED`: Transparent Red
  - `VinylVisualizer.VinylColor.DEEP_PURPLE`: Transparent Violet
  - `VinylVisualizer.VinylColor.ROYAL_BLUE`: Transparent Blue
  - `VinylVisualizer.VinylColor.MILKY_CLEAR`: Transparent
  - `VinylVisualizer.VinylColor.SWAMP_GREEN`: Swamp Green
  - `VinylVisualizer.VinylColor.SEA_BLUE`: Sea Blue
  - `VinylVisualizer.VinylColor.BONE`: Bone
  - `VinylVisualizer.VinylColor.BRONZE`: Bronze
  - `VinylVisualizer.VinylColor.BEER`: Beer
  - `VinylVisualizer.VinylColor.ELECTRIC_BLUE`: Electric Blue
  - `VinylVisualizer.VinylColor.GRIMACE_PURPLE`: Grimace Purple
  - `VinylVisualizer.VinylColor.OXBLOOD`: Oxblood
  - `VinylVisualizer.VinylColor.COKE_BOTTLE_GREEN`: Coke Bottle Green
  - `VinylVisualizer.VinylColor.ORANGE_CRUSH`: Orange Crush
  - `VinylVisualizer.VinylColor.HOT_PINK`: Hot Pink
  - `VinylVisualizer.VinylColor.BABY_PINK`: Baby Pink
  - `VinylVisualizer.VinylColor.OLIVE_GREEN`: Olive Green
  - `VinylVisualizer.VinylColor.AQUA_BLUE`: Aqua Blue
  - `VinylVisualizer.VinylColor.BABY_BLUE`: Baby Blue
  - `VinylVisualizer.VinylColor.HIGHLIGHTER_YELLOW`: Highlighter Yellow
  - `VinylVisualizer.VinylColor.GOLD`: Gold
  - `VinylVisualizer.VinylColor.SILVER`: Silver
  - `VinylVisualizer.VinylColor.MUSTARD`: Mustard

#### Vinyl#splatterColor([value:Number]):Vinyl

スプラッター用の二色目を設定します。引数を省略すると現在値を返します。

- `value:Number`
  - _`Vinyl#color`_ のパラメータと同様。

#### Vinyl#speed([value:Number]):Vinyl

回転数を指定します。引数を省略すると現在値を返します。

- `value:Number`
  - `33`: 33rpm
  - `45`: 45rpm

#### Vinyl#texture([value:Object]):Vinyl

テクスチャを Object 形式で指定します。引数を省略すると現在値を返します。

Image は `HTMLImageElement` か `HTMLCanvasElement` で指定してください。

- `value:Object`: 

```
{
  aoMap: Image, // Ambient Occlusion
  bumpMap: Image, // Bump Map
  map: Image // Color Map
}
```

どれかひとつだけを変更する場合は以下のように対象のキーにのみ Image をセットしてください。

```
{
  map: Image
}
```

#### Vinyl#labelTexture([value:Object]):Vinyl

テクスチャを Object 形式で指定します。引数を省略すると現在値を返します。

Image は `HTMLImageElement` か `HTMLCanvasElement` で指定してください。

- `value:Object`: 

```
{
  aoMap: Image, // Ambient Occlusion
  bumpMap: Image, // Bump Map
  map: Image // Color Map
}
```

どれかひとつだけを変更する場合は以下のように対象のキーにのみ Image をセットしてください。

```
{
  map: Image
}
```

### Sleeve

#### Sleeve#type([value:String]):Sleeve

タイプを指定します。引数を省略すると現在値を返します。

- `value:Number`
  - `VinylVisualizer.SleeveFormat.SINGLE_WITHOUT_SPINE`: Single w/o Spine
  - `VinylVisualizer.SleeveFormat.SINGLE`: Single (3mm spine)
  - `VinylVisualizer.SleeveFormat.DOUBLE`: Double (5mm spine)
  - `VinylVisualizer.SleeveFormat.GATEFOLD`: Gatefold

#### Sleeve#size([value:String]):Sleeve

サイズを指定します。引数を省略すると現在値を返します。

- `value:String`
  - `VinylVisualizer.SleeveSize.SIZE_7`: 7″
  - `VinylVisualizer.SleeveSize.SIZE_10`: 10″
  - `VinylVisualizer.SleeveSize.SIZE_12`: 12″

#### Sleeve#colorFormat([value:String]):Sleeve

カラーのフォーマットを指定します。引数を省略すると現在値を返します。

- `value:String`
  - `VinylVisualizer.SleeveColorFormat.WHITE`: ホワイト
  - `VinylVisualizer.SleeveColorFormat.BLACK`: ブラック
  - `VinylVisualizer.SleeveColorFormat.PRINT`: プリント

#### Sleeve#hole([value:String]):Sleeve

ホールのタイプを指定します。引数を省略すると現在値を返します。

- `value:String`
  - `VinylVisualizer.SleeveHole.NO_HOLE`: ホールなし
  - `VinylVisualizer.SleeveHole.HOLED`: ホールあり

#### Sleeve#finish([value:String]):Sleeve

表面仕上げのタイプを指定します。引数を省略すると現在値を返します。

- `value:String`
  - `VinylVisualizer.SleeveFinish.NORMAL`: 光沢なし
  - `VinylVisualizer.SleeveFinish.GLOSS`: 光沢あり

#### Sleeve#texture([value:Object]):Sleeve

テクスチャを Object 形式で指定します。引数を省略すると現在値を返します。

Image は `HTMLImageElement` か `HTMLCanvasElement` で指定してください。

- `value:Object`: 

```
{
  aoMap: Image, // Ambient Occlusion
  bumpMap: Image, // Bump Map
  map: Image // Color Map
}
```

どれかひとつだけを変更する場合は以下のように対象のキーにのみ Image をセットしてください。

```
{
  map: Image
}
```

### World

WebGL 描画クラスです。

#### World(vv:VinylVisualizer, opts:Object):World

World を生成します。

- `vv:VinylVisualizer`: VinylVisualizer への参照。イベントデリゲート用に使用します。
- `opts:Object`
  - `opts.width:Number`: 横幅の初期値。
  - `opts.height:Number` 高さの初期値。
  - `opts.renderer:Object`: レンダラ用オプション。
    - `opts.renderer.antialias:Boolean`
    - `opts.renderer.alpha:Boolean`
    - `opts.renderer.preserveDrawingBuffer:Boolean`
  - `opts.camera:Object:` カメラ用オプション。
    - `opts.fov:Number`
    - `opts.aspect:Number`
    - `opts.near:Number`
    - `opts.far:Number`

#### World.camera:THREE.Camera

`THREE.Camera` の参照。マニュアル運転用。

#### World.renderer:THREE.Renderer

`THREE.Renderer` の参照。マニュアル運転用。 `renderer.domElement` で `HTMLCanvasElement` を取得可能。
