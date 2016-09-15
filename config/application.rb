require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Leaderboard
  class Application < Rails::Application
    config.active_record.raise_in_transactional_callbacks = true
    Dir[Rails.root.join('app', 'validations', "*.rb")].each {|l| require l }
    config.api_authorization_token = ENV.fetch('API_AUTHORIZATION_TOKEN', 'notasecret')
    config.middleware.insert_before 0, "Rack::Cors" do
      allow do
        origins '*'
        resource '*', :headers => :any, :methods => [:get, :post, :options]
      end
    end
  end
end
