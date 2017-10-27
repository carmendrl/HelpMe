Rails.application.routes.draw do
  mount_devise_token_auth_for "User", at: "users", controllers: {
    registrations: "registrations",
    sessions: "sessions"
  }

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :lab_sessions, only: :create
  root to: "root#index"
end
