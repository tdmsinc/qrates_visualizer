require "qrates_visualizer/version"

module QratesVisualizer
  module Rails
    if defined?(::Rails)
      class Engine < ::Rails::Engine
        initializer 'qrates_visualizer.assets.precompile' do |app|
          app.config.assets.precompile << 'config/qrates_visualizer_manifest.js'
        end
      end
    end
  end
end
