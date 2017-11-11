Rails.application.routes.draw do
  mount_devise_token_auth_for "User", at: "users", controllers: {
    registrations: "registrations",
    sessions: "sessions"
  }

  resources :lab_sessions, only: :create do
    resources :questions
  end
  root to: "root#index"
end
