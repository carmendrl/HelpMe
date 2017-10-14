Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :lab_sessions, only: :create
  root to: "root#index"
end
