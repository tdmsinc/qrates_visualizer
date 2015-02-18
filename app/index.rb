
ENV['RACK_ENV'] ||= 'development'

require 'bundler/setup'

Bundler.require(:default, ENV['RACK_ENV'])

class App < Sinatra::Base
  configure do
    set :assets_precompile, %w(app.js app.css *.png *.jpg *.svg *.eot *.ttf *.woff)
    set :assets_prefix, %w(app/assets vendor/assets)
    set :assets_css_compressor, :sass
    register Sinatra::AssetPipeline

    if defined?(RailsAssets)
      RailsAssets.load_paths.each do |path|
        settings.sprockets.append_path(path)
      end
    end
  end

  get '/' do
    slim :index
  end
end
