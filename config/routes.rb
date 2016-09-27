Rails.application.routes.draw do
  resources :entries, except: [:new, :edit]
  get '/ping', to: 'ping#index'
  scope '/' do
    root 'ember#index'
    mount Rack::File.new('./ember/dist/assets') => '/assets'
    get '*rest', to: 'ember#index'
  end
end
