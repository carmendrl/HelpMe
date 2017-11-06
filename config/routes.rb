Rails.application.routes.draw do
  mount_devise_token_auth_for "User", at: "users", controllers: {
    registrations: "registrations",
    sessions: "sessions"
  }

  resources :lab_sessions, only: :create do
    resources :questions
  end

  post "lab_sessions/join/:token", to: "lab_session_memberships#create"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :lab_sessions, only: :create

  root to: "root#index"
end
