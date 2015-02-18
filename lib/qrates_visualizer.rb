require "qrates_visualizer/version"
require "rails-assets-tdmsinc-three.js"
require "rails-assets-tiny-emitter"

module QratesVisualizer
  module Rails
    if defined?(::Rails)
      class Engine < ::Rails::Engine
      end
    end
  end
end
