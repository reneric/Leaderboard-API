Rails.application.routes.draw do
  resources :entries, except: [:new, :edit]

  end
