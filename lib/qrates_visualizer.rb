require "qrates_visualizer/version"

module QratesVisualizer
  module Rails
    if defined?(::Rails)
      class Engine < ::Rails::Engine
      end
    end
  end
end
