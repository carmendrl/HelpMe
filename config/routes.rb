Rails.application.routes.draw do
  mount_devise_token_auth_for "User", at: "users", controllers: {
    registrations: "registrations",
    sessions: "sessions"
  }

  devise_scope :user do
    get "system/users/:user_id", to: "registrations#show", as: :user
  end

  resources :lab_sessions do
    delete "leave", on: :member, to: "lab_session_memberships#destroy"

    resources :questions do
      get "claim", on: :member

      resource :askers
      resource :answer
    end
  end
  post "lab_sessions/join/:token", to: "lab_session_memberships#create"

  resources :courses do

    scope module: :courses do
      resources :students
    end
  end

  root to: "root#index"
end
